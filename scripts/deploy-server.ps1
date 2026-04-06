param(
    [string]$ConfigPath = 'deploy/server.env'
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
. (Join-Path $ProjectRoot 'scripts\lib\server-tools.ps1')

$config = Import-ServerConfig -Path (Join-Path $ProjectRoot $ConfigPath)
$null = New-GeneratedDeployFiles -Config $config -ProjectRoot $ProjectRoot

$tempRoot = Join-Path $env:TEMP ("my-portfolio-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null
$archivePath = Join-Path $tempRoot 'deploy-package.tar.gz'
$remoteArchivePath = '/tmp/wangzhan-deploy-package.tar.gz'

Push-Location $ProjectRoot
try {
    & tar -czf $archivePath `
        --exclude=.git `
        --exclude=frontend/node_modules `
        --exclude=backend/node_modules `
        --exclude=frontend/dist `
        --exclude=frontend/.env `
        --exclude=backend/.env `
        backend frontend deploy package.json README.md

    if ($LASTEXITCODE -ne 0) {
        throw "tar exited with code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

Copy-ToServer -Config $config -Source $archivePath -Destination $remoteArchivePath

$repoDir = Get-ConfigValue -Config $config -Key 'SERVER_REPO_DIR' -Required
$frontendDir = Get-ConfigValue -Config $config -Key 'SERVER_FRONTEND_DIR' -Required
$backendPort = Get-ConfigValue -Config $config -Key 'BACKEND_PORT' -Required

$remoteCommand = @(
    'set -euo pipefail'
    "mkdir -p $(Get-BashSingleQuotedValue -Value $repoDir)"
    "tar -xzf $(Get-BashSingleQuotedValue -Value $remoteArchivePath) -C $(Get-BashSingleQuotedValue -Value $repoDir)"
    "cd $(Get-BashSingleQuotedValue -Value ($repoDir + '/frontend'))"
    'npm install'
    'npm run build'
    "mkdir -p $(Get-BashSingleQuotedValue -Value $frontendDir)"
    "cp -r dist/* $(Get-BashSingleQuotedValue -Value $frontendDir)/"
    "cd $(Get-BashSingleQuotedValue -Value ($repoDir + '/backend'))"
    'npm install'
    "cp $(Get-BashSingleQuotedValue -Value ($repoDir + '/deploy/generated/backend.env')) $(Get-BashSingleQuotedValue -Value ($repoDir + '/backend/.env'))"
    "pm2 startOrRestart $(Get-BashSingleQuotedValue -Value ($repoDir + '/deploy/generated/pm2/ecosystem.config.cjs')) --update-env"
    'pm2 save'
    "sudo cp $(Get-BashSingleQuotedValue -Value ($repoDir + '/deploy/generated/nginx/wangzhan.conf')) /etc/nginx/sites-available/wangzhan.conf"
    'sudo ln -sfn /etc/nginx/sites-available/wangzhan.conf /etc/nginx/sites-enabled/wangzhan.conf'
    'sudo nginx -t'
    'sudo systemctl reload nginx'
    "echo Deployment finished on port $backendPort"
) -join ' && '

try {
    Invoke-SshCommand -Config $config -RemoteCommand $remoteCommand -AllocateTty
}
finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Project deployed to $(Get-ServerTarget -Config $config)."