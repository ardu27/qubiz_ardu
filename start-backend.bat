@echo off
echo Oprire servicii existente pe porturile 5100, 5101, 5102, 5104...
powershell -Command "$ports = @(5100, 5101, 5102, 5104); foreach ($port in $ports) { $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue; if ($connections) { $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique; foreach ($procId in $pids) { if ($procId -gt 0) { Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue } } } }"

echo Pornire Meridian.Services.Employees pe portul 5101...
start "Employees Service" /D "%~dp0backend\Meridian.Services.Employees" dotnet run

echo Pornire Meridian.Services.Onboarding pe portul 5102...
start "Onboarding Service" /D "%~dp0backend\Meridian.Services.Onboarding" dotnet run

echo Pornire Meridian.Services.Booking pe portul 5104...
start "Booking Service" /D "%~dp0backend\Meridian.Services.Booking" dotnet run

echo Asteptam 5 secunde ca serviciile sa se initializeze...
timeout /t 5 /nobreak > nul

echo Pornire Meridian.Gateway pe portul 5100...
start "Gateway Service" /D "%~dp0backend\Meridian.Gateway" dotnet run

echo Toate cele 4 servicii au fost pornite in ferestre separate cu succes!
