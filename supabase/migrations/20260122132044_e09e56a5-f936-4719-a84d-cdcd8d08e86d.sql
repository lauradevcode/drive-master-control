-- Step 1/2: add new enum value (must be committed before use)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'instrutor'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'instrutor';
  END IF;
END $$;