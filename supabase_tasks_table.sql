-- ============================================
-- Supabase Database Schema for Personal Tasks
-- ============================================
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file and click "Run"
-- ============================================

-- Table for Personal Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since we're not using auth yet)
-- Anyone can read
CREATE POLICY "Allow public read access on tasks"
  ON tasks FOR SELECT
  TO public
  USING (true);

-- Anyone can insert
CREATE POLICY "Allow public insert access on tasks"
  ON tasks FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can update
CREATE POLICY "Allow public update access on tasks"
  ON tasks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Anyone can delete
CREATE POLICY "Allow public delete access on tasks"
  ON tasks FOR DELETE
  TO public
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at DESC);

-- Trigger to auto-update timestamps
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Tasks table created successfully!
-- ============================================