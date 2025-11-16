-- ============================================
-- Supabase Table Schema for Project Slides
-- ============================================
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file and click "Run"
-- ============================================

-- Table for Project Slides Data
CREATE TABLE IF NOT EXISTS project_slides (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE project_slides ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (matching existing pattern)
-- Anyone can read
CREATE POLICY "Allow public read access on project_slides"
  ON project_slides FOR SELECT
  TO public
  USING (true);

-- Anyone can insert
CREATE POLICY "Allow public insert access on project_slides"
  ON project_slides FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can update
CREATE POLICY "Allow public update access on project_slides"
  ON project_slides FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Anyone can delete
CREATE POLICY "Allow public delete access on project_slides"
  ON project_slides FOR DELETE
  TO public
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_project_slides_updated_at ON project_slides(updated_at DESC);

-- Trigger to auto-update timestamps
CREATE TRIGGER update_project_slides_updated_at BEFORE UPDATE ON project_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Project Slides table created successfully!
-- ============================================
