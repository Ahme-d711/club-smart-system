@echo off
echo.
echo ========================================
echo Club Smart System - Quick Start
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
node --version
echo.

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    echo Step 1: Installing root dependencies...
    "C:\Program Files\nodejs\npm.cmd" install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install root dependencies
        pause
        exit /b 1
    )
    
    echo.
    echo Step 2: Installing client dependencies...
    cd client
    "C:\Program Files\nodejs\npm.cmd" install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install client dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo.
    echo All dependencies installed successfully!
) else (
    echo Dependencies already installed.
)
echo.

echo Starting the application...
echo.
echo The application will start on:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.
pause

"C:\Program Files\nodejs\npm.cmd" run dev

