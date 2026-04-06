Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Import-ServerConfig {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Server config not found: $Path. Copy deploy/server.env.example to deploy/server.env first."
    }

    $config = @{}

    foreach ($line in Get-Content -LiteralPath $Path) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed.StartsWith('#')) {
            continue
        }

        $parts = $trimmed -split '=', 2
        if ($parts.Count -ne 2) {
            continue
        }

        $key = $parts[0].Trim()
        $value = $parts[1].Trim()

        if ($value.Length -ge 2) {
            if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                $value = $value.Substring(1, $value.Length - 2)
            }
        }

        $config[$key] = $value
    }

    if (-not $config.ContainsKey('SERVER_PORT') -or [string]::IsNullOrWhiteSpace($config['SERVER_PORT'])) {
        $config['SERVER_PORT'] = '22'
    }

    if (-not $config.ContainsKey('SERVER_BASE_DIR') -or [string]::IsNullOrWhiteSpace($config['SERVER_BASE_DIR'])) {
        $config['SERVER_BASE_DIR'] = '/var/www/wangzhan'
    }

    if (-not $config.ContainsKey('SERVER_REPO_DIR') -or [string]::IsNullOrWhiteSpace($config['SERVER_REPO_DIR'])) {
        $config['SERVER_REPO_DIR'] = '/var/www/wangzhan/repo'
    }

    if (-not $config.ContainsKey('SERVER_FRONTEND_DIR') -or [string]::IsNullOrWhiteSpace($config['SERVER_FRONTEND_DIR'])) {
        $config['SERVER_FRONTEND_DIR'] = '/var/www/wangzhan/frontend-dist'
    }

    if (-not $config.ContainsKey('BACKEND_PORT') -or [string]::IsNullOrWhiteSpace($config['BACKEND_PORT'])) {
        $config['BACKEND_PORT'] = '3001'
    }

    return $config
}

function Get-ConfigValue {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Config,
        [Parameter(Mandatory = $true)]
        [string]$Key,
        [switch]$Required,
        [string]$Default = ''
    )

    if ($Config.ContainsKey($Key) -and -not [string]::IsNullOrWhiteSpace($Config[$Key])) {
        return $Config[$Key]
    }

    if ($Required) {
        throw "Missing required config value: $Key"
    }

    return $Default
}

function Get-ServerTarget {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Config
    )

    $hostName = Get-ConfigValue -Config $Config -Key 'SERVER_HOST' -Required
    $userName = Get-ConfigValue -Config $Config -Key 'SERVER_USER' -Required
    return "${userName}@${hostName}"
}

function Get-LocalSshKeyPath {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Config
    )

    $configuredPath = Get-ConfigValue -Config $Config -Key 'SSH_KEY_PATH'
    if (-not [string]::IsNullOrWhiteSpace($configuredPath)) {
        return $configuredPath
    }

    return (Join-Path $HOME '.ssh\id_ed25519')
}

function Get-SshArgList {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Config
    )

    $args = @('-p', (Get-ConfigValue -Config $Config -Key 'SERVER_PORT' -Default '22'))
    $keyPath = Get-LocalSshKeyPath -Config $Config

    if (Test-Path -LiteralPath $keyPath) {
        $args += @('-i', $keyPath)
    }

    return $args
}

function Invoke-SshCommand {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Config,
        [string]$RemoteCommand,
        [switch]$AllocateTty
    )

    $args = Get-SshArgList -Config $Config
    if ($AllocateTty) {
        $args += '-t'
    }

    $args += (Get-ServerTarget -Config $Config)

    if (-not [string]::IsNullOrWhiteSpace($RemoteCommand)) {
        $args += $RemoteCommand
    }

    & ssh @args
    if ($LASTEXITCODE -ne 0) {
        throw "ssh exited with code $LASTEXITCODE"
    }
}

function Copy-ToServer {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Config,
        [Parameter(Mandatory = $true)]
        [string]$Source,
        [Parameter(Mandatory = $true)]
        [string]$Destination
    )

    $args = Get-SshArgList -Config $Config
    $args += $Source
    $args += "$(Get-ServerTarget -Config $Config):$Destination"

    & scp @args
    if ($LASTEXITCODE -ne 0) {
        throw "scp exited with code $LASTEXITCODE"
    }
}

function Get-BashSingleQuotedValue {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Value
    )

    $replacement = "'" + '"' + "'" + '"' + "'"
    return "'" + $Value.Replace("'", $replacement) + "'"
}

function New-GeneratedDeployFiles {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Config,
        [Parameter(Mandatory = $true)]
        [string]$ProjectRoot
    )

    $generatedRoot = Join-Path $ProjectRoot 'deploy\generated'
    $nginxDir = Join-Path $generatedRoot 'nginx'
    $pm2Dir = Join-Path $generatedRoot 'pm2'

    New-Item -ItemType Directory -Force -Path $nginxDir | Out-Null
    New-Item -ItemType Directory -Force -Path $pm2Dir | Out-Null

    $domain = Get-ConfigValue -Config $Config -Key 'SERVER_DOMAIN'
    $altDomain = Get-ConfigValue -Config $Config -Key 'SERVER_ALT_DOMAIN'
    $hostName = Get-ConfigValue -Config $Config -Key 'SERVER_HOST' -Required

    $serverNames = @($domain, $altDomain) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    if ($serverNames.Count -eq 0) {
        $serverNames = @($hostName)
    }

    $templateValues = @{
        SERVER_NAME = ($serverNames -join ' ')
        SERVER_FRONTEND_DIR = Get-ConfigValue -Config $Config -Key 'SERVER_FRONTEND_DIR' -Required
        BACKEND_PORT = Get-ConfigValue -Config $Config -Key 'BACKEND_PORT' -Required
        SERVER_REPO_DIR = Get-ConfigValue -Config $Config -Key 'SERVER_REPO_DIR' -Required
    }

    $nginxTemplate = Get-Content -LiteralPath (Join-Path $ProjectRoot 'deploy\templates\nginx.conf.tpl') -Raw
    $pm2Template = Get-Content -LiteralPath (Join-Path $ProjectRoot 'deploy\templates\ecosystem.config.cjs.tpl') -Raw

    foreach ($entry in $templateValues.GetEnumerator()) {
        $token = "__$($entry.Key)__"
        $nginxTemplate = $nginxTemplate.Replace($token, $entry.Value)
        $pm2Template = $pm2Template.Replace($token, $entry.Value)
    }

    $nginxOutput = Join-Path $nginxDir 'wangzhan.conf'
    $pm2Output = Join-Path $pm2Dir 'ecosystem.config.cjs'
    $backendEnvOutput = Join-Path $generatedRoot 'backend.env'

    [System.IO.File]::WriteAllText($nginxOutput, $nginxTemplate, (New-Object System.Text.UTF8Encoding($false)))
    [System.IO.File]::WriteAllText($pm2Output, $pm2Template, (New-Object System.Text.UTF8Encoding($false)))

    $backendEnv = @(
        "PORT=$($templateValues['BACKEND_PORT'])"
    )

    $corsOrigin = Get-ConfigValue -Config $Config -Key 'CORS_ORIGIN'
    if (-not [string]::IsNullOrWhiteSpace($corsOrigin)) {
        $backendEnv += "CORS_ORIGIN=$corsOrigin"
    }

    [System.IO.File]::WriteAllText($backendEnvOutput, ($backendEnv -join [Environment]::NewLine), (New-Object System.Text.UTF8Encoding($false)))

    return @{
        GeneratedRoot = $generatedRoot
        NginxConfig = $nginxOutput
        Pm2Config = $pm2Output
        BackendEnv = $backendEnvOutput
    }
}