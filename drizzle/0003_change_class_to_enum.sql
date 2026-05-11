-- Migration: convert integer class to text code like '1A'

BEGIN;

-- Add new temporary column
ALTER TABLE borrowings ADD COLUMN class_text TEXT;

-- Populate class_text based on existing integer class (grade*10 + id)
-- Example: 11 -> '1A' (1 year, id 1 -> A)
UPDATE borrowings SET class_text = ((class / 10)::text || chr(64 + (class % 10)));

-- Drop old integer column
ALTER TABLE borrowings DROP COLUMN class;

-- Rename new column to class
ALTER TABLE borrowings RENAME COLUMN class_text TO class;

-- Add constraint to ensure valid values (1-6 grades and A-D)
ALTER TABLE borrowings ADD CONSTRAINT class_format_check CHECK (class ~ '^[1-6][A-D]$');

COMMIT;
