@echo off
echo.
echo ========================================
echo Starting Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Starting server on port 5000...
echo.

"C:\Program Files\nodejs\node.exe" server/index.js

pause

