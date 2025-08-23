@echo off
title Git Auto Push for Trip Planner AI
color 0A

echo.
echo ========================================
echo    🚀 TRIP PLANNER AI - GIT PUSH
echo ========================================
echo.

echo 📍 Current directory:
cd /d "%~dp0"
echo %CD%
echo.

echo 🔍 Checking Git status...
git status
echo.

echo ⏳ Adding all files...
git add .
echo.

echo 💾 Committing changes...
git commit -m "🔧 Fix Netlify deployment: Add netlify.toml, _redirects, and deployment guide"
echo.

echo 🌐 Checking remote origin...
git remote -v
echo.

echo 🚀 Pushing to main branch...
git push origin main
echo.

echo.
echo ========================================
echo           ✅ COMPLETED!
echo ========================================
echo.
echo 📋 Next steps for Netlify:
echo 1. Go to your Netlify dashboard
echo 2. Update build settings:
echo    - Build command: echo "Static files ready"
echo    - Publish directory: public
echo    - Node version: 18
echo 3. Redeploy your site
echo.
echo Press any key to exit...
pause >nul
