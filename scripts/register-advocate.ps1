# Register an advocate via POST /api/auth/register (JSON body, no files)
# Usage: .\scripts\register-advocate.ps1 [-BaseUrl "http://localhost:3000"]

param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BodyFile = Join-Path $ScriptDir "advocate-register-body.json"

if (-not (Test-Path $BodyFile)) {
    Write-Error "File not found: $BodyFile"
    exit 1
}

$body = Get-Content $BodyFile -Raw
Write-Host "Registering advocate at $BaseUrl/api/auth/register ..."
Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" -Method Post -ContentType "application/json" -Body $body
