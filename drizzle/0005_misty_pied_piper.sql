ALTER TABLE "equipments" ALTER COLUMN "updated_at" SET DEFAULT now();
UPDATE "equipments"
SET "updated_at" = now()
WHERE "updated_at" IS NULL;
ALTER TABLE "equipments" ALTER COLUMN "updated_at" SET NOT NULL;
