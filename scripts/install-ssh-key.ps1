param(
    [string]$ConfigPath = 'deploy/server.env'
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
. (Join-Path $ProjectRoot 'scripts\lib\server-tools.ps1')

$config = Import-ServerConfig -Path (Join-Path $ProjectRoot $ConfigPath)
$keyPath = Get-LocalSshKeyPath -Config $config
$pubKeyPath = "$keyPath.pub"

if (-not (Test-Path -LiteralPath $keyPath)) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $keyPath) | Out-Null
    & ssh-keygen -t ed25519 -f $keyPath -N ''
    if ($LASTEXITCODE -ne 0) {
        throw "ssh-keygen exited with code $LASTEXITCODE"
    }
}

if (-not (Test-Path -LiteralPath $pubKeyPath)) {
    throw "Public key not found: $pubKeyPath"
}

$publicKey = (Get-Content -LiteralPath $pubKeyPath -Raw).Trim()
$quotedKey = Get-BashSingleQuotedValue -Value $publicKey
$remoteCommand = @(
    'umask 077'
    'mkdir -p ~/.ssh'
    'touch ~/.ssh/authorized_keys'
    "grep -qxF $quotedKey ~/.ssh/authorized_keys || echo $quotedKey >> ~/.ssh/authorized_keys"
) -join '; '

Invoke-SshCommand -Config $config -RemoteCommand $remoteCommand -AllocateTty
Write-Host "SSH public key installed on $(Get-ServerTarget -Config $config)."