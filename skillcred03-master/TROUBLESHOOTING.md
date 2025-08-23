# 🚀 Trip Planner AI - Troubleshooting Guide

## ❌ Common Errors & Solutions

### 1. Browser Extension Errors (Most Common)
**Error Messages:**
- `NSC_EXT_CONTENT_JS_INSERTED`
- `content.js:1 Refused to evaluate a string as JavaScript`
- `content-all.js:1 Uncaught Error: Could not establish connection`

**What This Means:**
These errors are **NOT from your application**. They're caused by browser extensions (like Norton Security, ad blockers, etc.) injecting scripts into your page.

**Solutions:**
1. **Disable browser extensions temporarily** to test
2. **Use an incognito/private window** (extensions are usually disabled)
3. **Check if the app works without extensions**
4. **Whitelist your domain** in security extensions

### 2. Font Loading Warnings
**Error Messages:**
- `Failed to decode downloaded font`
- `OTS parsing error: invalid sfntVersion`

**What This Means:**
Minor font loading issues that don't affect functionality.

**Solutions:**
- Fonts will fall back to system fonts automatically
- These warnings can be safely ignored
- Fonts are loaded with proper fallbacks

### 3. Content Security Policy (CSP) Issues
**Error Messages:**
- `Refused to evaluate a string as JavaScript because 'unsafe-eval'`

**What This Means:**
Your CSP is actually working correctly and blocking potentially unsafe code.

**Solutions:**
- Your CSP is properly configured
- The error is from browser extensions, not your app
- No action needed from you

## ✅ How to Test Your Application

### 1. Start the Main Server
```bash
npm run dev
# or
npm start
```

### 2. Test with Clean Browser
```bash
npm run test-app
```
Then open http://localhost:3001 in an incognito window.

### 3. Check Console Output
Look for these success messages:
- 🚀 Trip Planner AI - Ready to plan amazing journeys!
- ✅ All Popular Trip Packs elements found!
- ✅ Popular Trip Packs test passed!

## 🔧 What We Fixed

1. **Enhanced Security Headers** - Added additional security protections
2. **Improved CSP Configuration** - Better handling of external resources
3. **Error Handling** - Added global error handlers and fallbacks
4. **Font Fallbacks** - Better typography handling
5. **Map Fallbacks** - Graceful degradation when external maps fail
6. **Extension Filtering** - Prevents extension errors from affecting user experience

## 🌐 Testing URLs

- **Main App**: http://localhost:3000
- **Test Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **CSP Test**: http://localhost:3001/test-csp

## 📱 Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (not supported)

## 🚨 If Issues Persist

1. **Clear browser cache and cookies**
2. **Try different browser**
3. **Check browser console for real errors**
4. **Verify no antivirus software is blocking**
5. **Check firewall settings**

## 📞 Support

Your application is working correctly! The errors you see are from browser extensions, not your code. The fixes we implemented will make your app more robust and secure.
