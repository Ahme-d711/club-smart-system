@echo off
echo.
echo ========================================
echo Starting Club Smart System
echo ========================================
echo.
echo This will start BOTH backend and frontend
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo IMPORTANT: Keep this window open!
echo.
echo Press Ctrl+C to stop both servers
echo.
pause

cd /d "%~dp0"

echo Starting backend server...
start "Backend Server" cmd /k ""C:\Program Files\nodejs\node.exe" server/index.js"

timeout /t 3 /nobreak >nul

echo Starting frontend...
cd client
start "Frontend React" cmd /k ""C:\Program Files\nodejs\npm.cmd" start"

cd ..

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close the server windows to stop them.
echo.
pause

