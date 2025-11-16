-- ============================================
-- Supabase Database Schema for PM Tool
-- ============================================
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file and click "Run"
-- ============================================

-- Table for PM Tool Projects
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Action Items
CREATE TABLE IF NOT EXISTS actions (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since we're not using auth yet)
-- Anyone can read
CREATE POLICY "Allow public read access on projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on actions"
  ON actions FOR SELECT
  TO public
  USING (true);

-- Anyone can insert
CREATE POLICY "Allow public insert access on projects"
  ON projects FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public insert access on actions"
  ON actions FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can update
CREATE POLICY "Allow public update access on projects"
  ON projects FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update access on actions"
  ON actions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Anyone can delete
CREATE POLICY "Allow public delete access on projects"
  ON projects FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public delete access on actions"
  ON actions FOR DELETE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_actions_updated_at ON actions(updated_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update timestamps
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Schema created successfully!
-- ============================================
