# Supabase Integration Setup Guide

## Overview
This application now uses Supabase as the primary database backend with localStorage as a fallback cache. Data is automatically synced to both Supabase (server-side) and localStorage (client-side) for optimal performance and offline capability.

## ✅ What's Already Done

1. **Supabase Client Integration**
   - Added Supabase JavaScript client library to both `pmtool.html` and `actions.html`
   - Created `js/utils/supabaseClient.js` with your project credentials
   - Your Supabase URL and API key are already configured

2. **Database Schema**
   - SQL schema file created: `supabase_schema.sql`
   - Ready to create `projects` and `actions` tables
   - Includes Row Level Security (RLS) policies for public access

3. **Storage Layer Updated**
   - Modified `js/utils/storage.js` to use Supabase API
   - All save/load functions now async with Supabase integration
   - localStorage used as cache and fallback
   - Both PM Tool and Action Items updated

4. **Application Updates**
   - PM Tool (`js/app.js`) updated to handle async storage
   - Action Items (`js/actions/app.js`) updated to handle async storage
   - Auto-save now saves to both Supabase and localStorage

## 🚀 Setup Steps (YOU MUST DO THIS)

### Step 1: Run the SQL Schema

1. Open your Supabase dashboard at https://erumehpzdescjyfliceb.supabase.co
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Open the file `supabase_schema.sql` from this project
5. **Copy the entire contents** and paste into the SQL Editor
6. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
7. You should see: "Success. No rows returned"

**This creates:**
- `projects` table for PM Tool data
- `actions` table for Action Items data
- Row Level Security policies (allows public read/write)
- Automatic timestamp updates

### Step 2: Deploy to Your Web Server

1. Upload all files to your web server (same as before)
2. Ensure the Supabase CDN is accessible (it's from `cdn.jsdelivr.net`)
3. Your application will now automatically save to Supabase!

## 🔄 How It Works

### Data Flow

```
User makes change in app
       ↓
Auto-save triggered
       ↓
1. Save to localStorage (instant, cache)
2. Save to Supabase (async, database)
       ↓
If Supabase fails: localStorage still works
If Supabase succeeds: Data synced to cloud
```

### Load Priority

```
App loads
       ↓
1. Try to load from Supabase (latest data)
2. If Supabase fails: load from localStorage
3. If both fail: start with empty array
```

## 📊 Data Storage Structure

### Projects Table
```
- id: Unique identifier (auto-generated)
- data: JSONB field containing array of all projects
- created_at: Timestamp of creation
- updated_at: Timestamp of last update (auto-updated)
```

### Actions Table
```
- id: Unique identifier (auto-generated)
- data: JSONB field containing array of all actions
- created_at: Timestamp of creation
- updated_at: Timestamp of last update (auto-updated)
```

## ✨ Features

### Automatic Syncing
- Every change auto-saves to both localStorage and Supabase
- No manual save button needed
- Works across different computers/browsers with same data

### Fallback System
- If Supabase is down, app continues working with localStorage
- When Supabase comes back online, data syncs automatically
- Never lose data even if internet is temporarily unavailable

### Import/Export Still Works
- Excel import/export functions unchanged
- Imported data automatically saves to Supabase
- Export pulls from current data (Supabase or localStorage)

## 🔐 Security Notes

### Current Setup (Public Access)
- Anyone can read and write data
- Good for: Internal tools, prototypes, trusted networks
- No authentication required

### To Add Authentication (Optional)
If you want user-specific data:

1. Enable Email authentication in Supabase:
   - Go to Authentication → Providers → Email
   - Enable it

2. Update RLS policies to require authentication:
```sql
-- Replace existing policies with:
CREATE POLICY "Users can read own data" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

3. Add `user_id` column to tables
4. Modify JavaScript to handle login/signup

## 🧪 Testing

### Verify Database Connection

1. Open PM Tool in browser
2. Open browser console (F12)
3. Add a project
4. You should see:
   - "Auto-saved X projects to Supabase"
   - No errors

5. Go to Supabase dashboard → Table Editor
6. Click on `projects` table
7. You should see your data in the `data` column

### Test Cross-Device Sync

1. Add some projects on Computer A
2. Open PM Tool on Computer B (different browser/device)
3. The projects from Computer A should load automatically!

## 🐛 Troubleshooting

### "Failed to save to Supabase" error
- **Check:** Did you run the SQL schema? (Step 1 above)
- **Check:** Is your internet connection working?
- **Check:** Look in browser console for specific error
- **Note:** App still works with localStorage even if Supabase fails

### Data not syncing across devices
- **Check:** Did both devices save successfully to Supabase?
- **Check:** Are you looking at the same Supabase project?
- **Try:** Refresh the page to force a reload from Supabase

### "Row Level Security" error
- **Check:** Did you run ALL the SQL (including the policies)?
- **Fix:** Run the schema SQL again completely

## 📝 Maintenance

### Viewing Your Data
1. Go to Supabase Dashboard → Table Editor
2. Click `projects` or `actions` table
3. Click on any row to see the full JSON data

### Backing Up Data
1. Go to Supabase Dashboard → Table Editor
2. Click `projects` table → Export as CSV
3. Click `actions` table → Export as CSV
4. Store these backups safely

### Clearing Data
- Use the "Clear All" option in the app (clears both Supabase and localStorage)
- Or manually delete from Supabase Table Editor

## 🎯 Next Steps

1. ✅ Run the SQL schema (most important!)
2. ✅ Deploy updated files to your web server
3. ✅ Test that data saves to Supabase
4. ✅ Verify cross-device sync works
5. (Optional) Add user authentication if needed
6. (Optional) Set up automatic backups in Supabase

## 💡 Benefits of This Setup

- ✅ **Cloud-based:** Access your data from anywhere
- ✅ **Automatic sync:** No manual save/load needed
- ✅ **Offline-capable:** Works even without internet
- ✅ **Version history:** Supabase tracks when data was updated
- ✅ **Scalable:** Can handle large amounts of data
- ✅ **No server maintenance:** Supabase handles all infrastructure
- ✅ **Free tier:** Up to 500MB database, unlimited API requests
- ✅ **Import/Export:** Still works exactly as before

## 📧 Support

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Verify SQL schema was run successfully
3. Check Supabase project status at dashboard
4. Ensure all files were uploaded to web server

---

**Ready to go!** Just run the SQL schema and deploy. Your PM Tool and Action Items will now save to the cloud! 🚀
