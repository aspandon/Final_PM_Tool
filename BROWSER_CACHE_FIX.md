# Browser Cache Issue - Quick Fix

If you see an error like:
```
The requested module '../utils/storage.js' does not provide an export named 'loadTasks'
```

## Solution: Hard Refresh Your Browser

The browser has cached the old version of the JavaScript files. You need to clear the cache:

### Method 1: Hard Refresh (Recommended)
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`

### Method 2: Clear Cache Manually
1. Open Developer Tools (F12)
2. Right-click on the refresh button
3. Select "Empty Cache and Hard Reload"

### Method 3: Clear Browser Cache
1. Open browser settings
2. Clear browsing data
3. Select "Cached images and files"
4. Clear data

### Method 4: Disable Cache (For Development)
1. Open Developer Tools (F12)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Keep DevTools open while working

## Why This Happens

When JavaScript files are updated:
1. Old versions may be cached by the browser
2. The browser serves cached files instead of new ones
3. New imports/exports aren't available

## Verify the Fix

After hard refresh, check the browser console. You should see:
```
Loaded X personal tasks
Auto-saved X personal tasks to Supabase
```

Instead of import errors.
