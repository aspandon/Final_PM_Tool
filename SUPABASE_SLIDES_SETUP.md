# Project Slides Supabase Setup

This document explains how to set up the `project_slides` table in your Supabase database.

## Setup Instructions

1. **Go to your Supabase project dashboard**
   - Navigate to https://supabase.com
   - Open your PM Tool project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the setup script**
   - Open the file `supabase_slides_table.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run"

4. **Verify the table was created**
   - Click "Table Editor" in the left sidebar
   - You should see a new table called `project_slides`

## Table Structure

The `project_slides` table stores all slide data for projects under Implementation status:

- **id**: Auto-incrementing primary key
- **data**: JSONB field containing all slides data as an object
- **created_at**: Timestamp when the record was created
- **updated_at**: Timestamp when the record was last updated (auto-updated)

## Data Format

The `data` field contains an object where:
- Keys are project IDs
- Values are slide data objects containing all slide information (SAP ID, JIRA ID, phases, risks, etc.)

Example:
```json
{
  "project-123": {
    "sapId": "H/00050",
    "jiraId": "PMO-198",
    "pmBp": "John Doe",
    "phases": [...],
    "risks": [...],
    // ... other slide data
  },
  "project-456": {
    // ... another project's slide data
  }
}
```

## Security

The table uses Row Level Security (RLS) with public access policies, matching the pattern used for other tables in the PM Tool.

## Troubleshooting

If you encounter any errors:
1. Make sure you've already run `supabase_schema.sql` first (it creates the `update_updated_at_column()` function)
2. Check that you have the correct permissions in your Supabase project
3. Verify the table was created by checking the Table Editor

## Auto-Sync

Once set up, the PM Tool will automatically:
- Save slide data to Supabase whenever changes are made
- Load slide data from Supabase when the app starts
- Use localStorage as a cache and fallback
