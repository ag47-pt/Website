Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDirectory
$pythonExecutable = Join-Path $projectRoot ".venv\Scripts\python.exe"
$apiDirectory = Join-Path $projectRoot "apps\api"

if (-not (Test-Path -LiteralPath $pythonExecutable)) {
    throw "Python environment not found. Run scripts/setup.ps1 first."
}

Push-Location $apiDirectory
try {
    & $pythonExecutable -m alembic upgrade head
    & $pythonExecutable -m app.seed
}
finally {
    Pop-Location
}

Write-Output "[OK] Migration and idempotent demo seed completed."

