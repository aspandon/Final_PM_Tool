-- ============================================
-- Supabase Migration: Make Personal Tasks User-Specific
-- ============================================
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file and click "Run"
-- ============================================

-- Step 1: Add user_id column to tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Step 3: Drop old public policies
DROP POLICY IF EXISTS "Allow public read access on tasks" ON tasks;
DROP POLICY IF EXISTS "Allow public insert access on tasks" ON tasks;
DROP POLICY IF EXISTS "Allow public update access on tasks" ON tasks;
DROP POLICY IF EXISTS "Allow public delete access on tasks" ON tasks;

-- Step 4: Create new user-specific policies

-- Users can only read their own tasks
CREATE POLICY "Users can read own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can only insert tasks for themselves
CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own tasks
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own tasks
CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- Migration completed successfully!
--
-- Summary of changes:
-- 1. Added user_id column to tasks table
-- 2. Created index on user_id for better performance
-- 3. Removed public access policies
-- 4. Added user-specific RLS policies
--
-- Each user can now only:
-- - View their own tasks
-- - Create tasks for themselves
-- - Update their own tasks
-- - Delete their own tasks
-- ============================================
