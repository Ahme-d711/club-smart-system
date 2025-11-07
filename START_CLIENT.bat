@echo off
echo.
echo ========================================
echo Starting Frontend (React App)
echo ========================================
echo.

cd /d "%~dp0\client"

echo Starting React app on port 3000...
echo.

"C:\Program Files\nodejs\npm.cmd" start

pause

