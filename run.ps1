$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (Get-Command node -ErrorAction SilentlyContinue) {
    if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules'))) {
        Write-Host "Installing dependencies..."
        npm.cmd install
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }
    Write-Host "Building frontend..."
    npm.cmd run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host "Starting AVAJET ERP..."
    node (Join-Path $PSScriptRoot 'server.js')
    exit $LASTEXITCODE
}

$nodeExe = Join-Path $PSScriptRoot '..\..\..\..\tools\node\node.exe'
$npmCli = Join-Path $PSScriptRoot '..\..\..\..\tools\node\node_modules\npm\bin\npm-cli.js'
if (-not (Test-Path -LiteralPath $nodeExe)) { throw "Node.js not found in PATH or at $nodeExe" }
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules\vite\bin\vite.js'))) { & $nodeExe $npmCli install; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
& $nodeExe $npmCli run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& $nodeExe (Join-Path $PSScriptRoot 'server.js')

