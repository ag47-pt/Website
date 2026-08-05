param(
    [string]$ApiBaseUrl = "http://localhost:8000",
    [string]$WebBaseUrl = "http://localhost:3000"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$health = Invoke-RestMethod -Uri "$ApiBaseUrl/health" -Method Get
$status = Invoke-RestMethod -Uri "$ApiBaseUrl/api/v1/system/status" -Method Get
$web = Invoke-WebRequest -Uri $WebBaseUrl -Method Get -UseBasicParsing

if ($web.StatusCode -ne 200) {
    throw "Web smoke failed with HTTP $($web.StatusCode)."
}

Write-Output "[OK] API health: $($health.status)"
Write-Output "[OK] Provider mode: $($status.mode)"
Write-Output "[OK] Web HTTP: $($web.StatusCode)"
