@echo off
REM Batch file to run npm commands without PowerShell execution policy issues

cd /d "%~dp0"

echo.
echo ========================================
echo Club Smart System - NPM Helper
echo ========================================
echo.

if "%1"=="" (
    echo Usage: run-npm.bat [command]
    echo.
    echo Examples:
    echo   run-npm.bat install-all
    echo   run-npm.bat install
    echo   run-npm.bat dev
    echo   run-npm.bat server
    echo   run-npm.bat client
    echo.
    pause
    exit /b
)

if "%1"=="install-all" (
    echo Installing root dependencies...
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
    echo Done! All dependencies installed.
    pause
    exit /b
)

"C:\Program Files\nodejs\npm.cmd" %*

