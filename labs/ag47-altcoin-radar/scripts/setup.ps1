Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDirectory
$venvDirectory = Join-Path $projectRoot ".venv"
$pythonExecutable = Join-Path $venvDirectory "Scripts\python.exe"
$apiPackage = Join-Path $projectRoot "apps\api"
$apiPackageWithExtras = "${apiPackage}[dev]"
$webDirectory = Join-Path $projectRoot "apps\web"

Set-Location $projectRoot

if (-not (Test-Path -LiteralPath $pythonExecutable)) {
    py -3.12 -m venv $venvDirectory
}

& $pythonExecutable -m pip install --upgrade pip
& $pythonExecutable -m pip install -e $apiPackageWithExtras
npm install
npm --prefix $webDirectory install

Write-Output "[OK] Dependencies installed."
Write-Output "[INFO] Run scripts/seed.ps1, then activate .venv and run npm run dev."
