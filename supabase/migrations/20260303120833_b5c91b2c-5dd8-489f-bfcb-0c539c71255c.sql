
-- Add column for car preference
ALTER TABLE public.instrutores
ADD COLUMN uso_veiculo text NOT NULL DEFAULT 'proprio';

-- Drop the broken restrictive INSERT policy
DROP POLICY IF EXISTS "Qualquer um pode se cadastrar como instrutor" ON public.instrutores;

-- Recreate as PERMISSIVE so anon/authenticated users can register
CREATE POLICY "Qualquer um pode se cadastrar como instrutor"
ON public.instrutores
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
