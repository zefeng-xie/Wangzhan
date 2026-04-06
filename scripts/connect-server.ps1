param(
    [string]$ConfigPath = 'deploy/server.env'
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
. (Join-Path $ProjectRoot 'scripts\lib\server-tools.ps1')

$config = Import-ServerConfig -Path (Join-Path $ProjectRoot $ConfigPath)
Invoke-SshCommand -Config $config -AllocateTty