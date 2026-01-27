-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type VARCHAR(50),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_materials_uploaded_by ON materials(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at);

-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view materials"
  ON materials
  FOR SELECT
  USING (true);

CREATE POLICY "Instructors can insert materials"
  ON materials
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('admin', 'instrutor')
    )
  );

CREATE POLICY "Users can only delete their own materials"
  ON materials
  FOR DELETE
  USING (
    uploaded_by = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create storage bucket for materials if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view materials"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'materials');

CREATE POLICY "Instructors can upload materials"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'materials' 
    AND EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role IN ('admin', 'instrutor')
    )
  );

CREATE POLICY "Users can delete their own materials"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'materials'
    AND (
      owner = auth.uid()
      OR EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
      )
    )
  );
