@echo off
echo.
echo ========================================
echo Club Smart System - Install Dependencies
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

echo Installing root dependencies...
echo This may take a few minutes...
"C:\Program Files\nodejs\npm.cmd" install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
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
echo ========================================
echo All dependencies installed successfully!
echo ========================================
echo.
echo You can now start the application with:
echo   npm run dev
echo.
pause

