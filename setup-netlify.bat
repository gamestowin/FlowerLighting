@echo off
REM FlowerLighting Netlify Deployment Setup Script
REM This script prepares your project for Netlify deployment

echo.
echo ========================================
echo  FlowerLighting - Netlify Setup Script
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✓ Git found
echo.

REM Initialize Git repository if not already done
if not exist .git (
    echo Initializing Git repository...
    git init
    echo ✓ Git repository initialized
) else (
    echo ✓ Git repository already exists
)

echo.

REM Configure Git user (optional)
echo Configuring Git user (you can skip if already configured)...
git config user.email "your-email@example.com"
git config user.name "Your Name"

echo.

REM Add all files
echo Adding files to Git...
git add .
echo ✓ Files added

echo.

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial FlowerLighting deployment setup" --allow-empty
echo ✓ Initial commit created

echo.

REM Display next steps
echo ========================================
echo  NEXT STEPS:
echo ========================================
echo.
echo 1. Create GitHub repository:
echo    - Go to: https://github.com/new
echo    - Repository name: flowerlighting
echo    - Don't initialize with README
echo.
echo 2. Push code to GitHub:
echo    - Copy your repository URL from GitHub
echo    - Run these commands:
echo      git remote add origin YOUR_REPO_URL
echo      git branch -M main
echo      git push -u origin main
echo.
echo 3. Connect to Netlify:
echo    - Go to: https://app.netlify.com
echo    - Click "Add new site"
echo    - Choose GitHub and select "flowerlighting"
echo    - Build command: npm run build
echo    - Publish directory: dist
echo    - Add DATABASE_URL to environment variables
echo.
echo 4. Deploy:
echo    - Netlify will automatically build and deploy!
echo.
echo ========================================
echo.
echo Need help? See NETLIFY_SETUP.md for detailed instructions.
echo.

pause
