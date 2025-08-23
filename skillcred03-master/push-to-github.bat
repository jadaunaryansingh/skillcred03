@echo off
echo 🚀 Starting Git Push Process...
echo.

echo 📋 Current Git Status:
git status
echo.

echo 🔧 Adding all changes...
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

echo ✅ Git push completed!
echo.
echo 📋 Next steps:
echo 1. Go to your Netlify dashboard
echo 2. Update build settings:
echo    - Build command: echo "Static files ready"
echo    - Publish directory: public
echo    - Node version: 18
echo 3. Redeploy your site
echo.
pause
