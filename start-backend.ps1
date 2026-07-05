# stop-and-start-services.ps1
Write-Host "Oprire servicii existente pe porturile 5100, 5101, 5102, 5104..." -ForegroundColor Yellow

$ports = @(5100, 5101, 5102, 5104)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $pids) {
            if ($procId -gt 0) {
                Write-Host "Killing process $procId listening on port $port..." -ForegroundColor Cyan
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Host "Pornire microservicii backend..." -ForegroundColor Green

# 1. Services.Employees
Write-Host "Pornire Meridian.Services.Employees (Port 5101)..."
Start-Process dotnet -ArgumentList "run" -WorkingDirectory "$PSScriptRoot\backend\Meridian.Services.Employees" -NoNewWindow

# 2. Services.Onboarding
Write-Host "Pornire Meridian.Services.Onboarding (Port 5102)..."
Start-Process dotnet -ArgumentList "run" -WorkingDirectory "$PSScriptRoot\backend\Meridian.Services.Onboarding" -NoNewWindow

# 3. Services.Booking
Write-Host "Pornire Meridian.Services.Booking (Port 5104)..."
Start-Process dotnet -ArgumentList "run" -WorkingDirectory "$PSScriptRoot\backend\Meridian.Services.Booking" -NoNewWindow

# Asteapta 5 secunde pentru ca microserviciile sa fie gata inainte de Gateway
Start-Sleep -Seconds 5

# 4. Gateway
Write-Host "Pornire Meridian.Gateway (Port 5100)..."
Start-Process dotnet -ArgumentList "run" -WorkingDirectory "$PSScriptRoot\backend\Meridian.Gateway" -NoNewWindow

Write-Host "Toate cele 4 servicii backend au fost pornite cu succes in fundal!" -ForegroundColor Green
Write-Host "Poti verifica gateway-ul la http://localhost:5100/swagger" -ForegroundColor Green
