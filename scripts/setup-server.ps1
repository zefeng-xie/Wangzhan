param(
    [string]$ConfigPath = 'deploy/server.env'
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
. (Join-Path $ProjectRoot 'scripts\lib\server-tools.ps1')

$config = Import-ServerConfig -Path (Join-Path $ProjectRoot $ConfigPath)
$remoteSetupPath = '/tmp/wangzhan-setup-server.sh'

Copy-ToServer -Config $config -Source (Join-Path $ProjectRoot 'deploy\setup-server.sh') -Destination $remoteSetupPath

$remoteCommand = @(
    "chmod +x $(Get-BashSingleQuotedValue -Value $remoteSetupPath)"
    "SERVER_BASE_DIR=$(Get-BashSingleQuotedValue -Value (Get-ConfigValue -Config $config -Key 'SERVER_BASE_DIR' -Required)) SERVER_REPO_DIR=$(Get-BashSingleQuotedValue -Value (Get-ConfigValue -Config $config -Key 'SERVER_REPO_DIR' -Required)) SERVER_FRONTEND_DIR=$(Get-BashSingleQuotedValue -Value (Get-ConfigValue -Config $config -Key 'SERVER_FRONTEND_DIR' -Required)) SERVER_USER=$(Get-BashSingleQuotedValue -Value (Get-ConfigValue -Config $config -Key 'SERVER_USER' -Required)) bash $(Get-BashSingleQuotedValue -Value $remoteSetupPath)"
) -join ' && '

Invoke-SshCommand -Config $config -RemoteCommand $remoteCommand -AllocateTty
Write-Host "Remote server setup finished for $(Get-ServerTarget -Config $config)."