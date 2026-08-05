Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDirectory
$pythonExecutable = Join-Path $projectRoot ".venv\Scripts\python.exe"
$apiDirectory = Join-Path $projectRoot "apps\api"
$webDirectory = Join-Path $projectRoot "apps\web"

if (-not (Test-Path -LiteralPath $pythonExecutable)) {
    throw "Python environment not found. Run scripts/setup.ps1 first."
}

Set-Location $projectRoot
npx prettier --check .
npm --prefix $webDirectory run lint
npm --prefix $webDirectory run typecheck
npm --prefix $webDirectory run test:run
npm --prefix $webDirectory run build

Push-Location $apiDirectory
try {
    & $pythonExecutable -m ruff format --check app tests
    & $pythonExecutable -m ruff check app tests
    & $pythonExecutable -m mypy app
    & $pythonExecutable -m pytest
    & $pythonExecutable -m compileall -q app
}
finally {
    Pop-Location
}

Write-Output "[OK] Scoped quality gates passed."

