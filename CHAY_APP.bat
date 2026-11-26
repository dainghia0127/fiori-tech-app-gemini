@echo off
title SAP Fiori Technical Academy

echo ==============================================================
echo       SAP FIORI TECHNICAL ACADEMY - AUTO LAUNCHER
echo ==============================================================
echo.

netstat -ano | findstr :8085 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] May chu da dang chay tren cong 8085.
    echo [OK] Dang mo Microsoft Edge...
    start msedge http://localhost:8085/index.html
) else (
    echo [INFO] Dang khoi dong may chu UI5 tren cong 8085...
    start "SAP Fiori Dev Server" /min cmd /c "cd /d "%~dp0src\frontend" && npx ui5 serve --port 8085"
    echo [INFO] Vui long doi may chu khoi dong trong giay lat...
    ping 127.0.0.1 -n 4 >nul 2>&1
    echo [OK] Dang mo Microsoft Edge...
    start msedge http://localhost:8085/index.html
)

echo.
echo [HOAN TAT] Ung dung da duoc mo tai: http://localhost:8085/index.html
ping 127.0.0.1 -n 3 >nul 2>&1
exit
