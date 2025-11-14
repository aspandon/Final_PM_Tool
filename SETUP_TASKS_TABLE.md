# Personal Tasks - Supabase Setup

## Overview

Personal Tasks are now stored in Supabase database (with localStorage fallback) for:
- ✅ Cloud backup
- ✅ Cross-device synchronization
- ✅ Real-time collaboration
- ✅ Data persistence

## Setup Instructions

To enable Supabase storage for Personal Tasks, you need to create the `tasks` table in your Supabase database.

### Step 1: Access Supabase SQL Editor

1. Go to your [Supabase project dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run the SQL Migration

1. Open the file `supabase_tasks_table.sql` in this repository
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **"Run"** button

### Step 3: Verify Table Creation

After running the SQL, you should see:
- ✅ New table `tasks` created
- ✅ Row Level Security (RLS) enabled
- ✅ Public access policies configured
- ✅ Indexes created for performance
- ✅ Timestamp triggers configured

### Step 4: Test the Application

1. Open the PM Tool
2. Go to the **Tasks** tab
3. Create a new task
4. Check the browser console - you should see:
   ```
   Shared tasks record created in Supabase with ID: X
   Auto-saved X personal tasks to Supabase
   ```

## Features

### Auto-Save
- Tasks automatically save to Supabase every time you make changes
- Changes also cached in localStorage for instant loading

### Auto-Refresh
- Every 45 seconds, the app checks Supabase for updates
- If another user/device made changes, they sync automatically
- You'll see: `🔄 Auto-refresh: New tasks data detected from Supabase`

### Fallback Strategy
- If Supabase is unavailable, tasks save to localStorage only
- When Supabase comes back online, tasks sync automatically
- No data loss during connectivity issues

## Data Structure

Each task is stored with:
```javascript
{
  id: "unique-timestamp",
  title: "Task title",
  description: "Task description",
  priority: "low" | "medium" | "high",
  dueDate: "YYYY-MM-DD",
  status: "new" | "in-progress" | "done",
  createdAt: "ISO timestamp"
}
```

## Shared Record Model

All users share ONE record in the Supabase `tasks` table:
- The oldest record (ID 1) is the shared record
- All task data stored in a JSONB column
- Enables real-time collaboration
- All users see the same tasks

## Troubleshooting

### Tasks not syncing to Supabase?

1. Check browser console for errors
2. Verify the SQL migration ran successfully
3. Check Supabase dashboard → Table Editor → tasks table exists
4. Verify Row Level Security policies are set correctly

### Want to start fresh?

Run this in Supabase SQL Editor:
```sql
DELETE FROM tasks;
```

Or use the "Clear All Data" function in the PM Tool menu.

## Notes

- Tasks sync across all users/devices using the same Supabase project
- localStorage serves as instant cache for better performance
- Changes take effect immediately without page refresh
- Background auto-refresh ensures everyone stays in sync
