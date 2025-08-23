# Git Auto Push Script for Trip Planner AI
Write-Host "🚀 Starting Git Operations..." -ForegroundColor Green

# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Change to script directory
Set-Location $PSScriptRoot

Write-Host "📍 Current directory: $PWD" -ForegroundColor Yellow

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check git status
Write-Host "🔍 Checking Git status..." -ForegroundColor Cyan
git status

# Add all files
Write-Host "⏳ Adding all files..." -ForegroundColor Cyan
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Cyan
git commit -m "🔧 Fix Netlify deployment: Add netlify.toml, _redirects, and deployment guide"

# Check remote
Write-Host "🌐 Checking remote origin..." -ForegroundColor Cyan
git remote -v

# Push to main
Write-Host "🚀 Pushing to main branch..." -ForegroundColor Green
git push origin main

Write-Host "✅ Git operations completed!" -ForegroundColor Green
Write-Host "📋 Check the output above for any errors." -ForegroundColor Yellow
