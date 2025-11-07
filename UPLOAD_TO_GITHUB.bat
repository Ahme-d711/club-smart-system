@echo off
echo.
echo ========================================
echo Upload Project to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Checking if Git is installed...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo Git is NOT installed!
    echo ========================================
    echo.
    echo Please install Git first:
    echo 1. Visit: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Make sure to check "Add Git to PATH"
    echo 4. Restart Command Prompt after installation
    echo.
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo Git found!
git --version
echo.

echo ========================================
echo Step 1: Initialize Git (if not already)
echo ========================================
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo Git repository initialized!
    echo.
) else (
    echo Git repository already initialized.
    echo.
)

echo ========================================
echo Step 2: Add files to Git
echo ========================================
echo Adding all files...
git add .
echo Files added!
echo.

echo ========================================
echo Step 3: Create commit
echo ========================================
echo Creating initial commit...
git commit -m "Initial commit: Club Smart System"
echo Commit created!
echo.

echo ========================================
echo Step 4: Connect to GitHub
echo ========================================
echo.
echo IMPORTANT: You need to:
echo 1. Create a repository on GitHub first
echo 2. Copy the repository URL
echo 3. Run these commands manually:
echo.
echo    git remote add origin YOUR_REPOSITORY_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo Replace YOUR_REPOSITORY_URL with your actual GitHub URL
echo Example: https://github.com/username/club-smart-system.git
echo.
echo ========================================
echo.
echo Would you like to enter your repository URL now? (Y/N)
set /p choice="Enter Y to continue, N to exit: "

if /i "%choice%"=="Y" (
    echo.
    set /p repo_url="Enter your GitHub repository URL: "
    echo.
    echo Adding remote origin...
    git remote add origin %repo_url%
    if %errorlevel% neq 0 (
        echo Warning: Remote might already exist. Continuing...
        git remote set-url origin %repo_url%
    )
    echo.
    echo Setting branch to main...
    git branch -M main
    echo.
    echo ========================================
    echo Step 5: Push to GitHub
    echo ========================================
    echo.
    echo You will be prompted for your GitHub credentials.
    echo Use your GitHub username and Personal Access Token.
    echo.
    echo To create a token:
    echo GitHub → Settings → Developer settings → Personal access tokens
    echo.
    pause
    echo.
    echo Pushing to GitHub...
    git push -u origin main
    echo.
    if %errorlevel% equ 0 (
        echo ========================================
        echo Success! Your code is now on GitHub!
        echo ========================================
    ) else (
        echo ========================================
        echo Push failed. Check your credentials.
        echo ========================================
    )
) else (
    echo.
    echo You can run the commands manually:
    echo git remote add origin YOUR_REPOSITORY_URL
    echo git branch -M main
    echo git push -u origin main
)

echo.
pause
