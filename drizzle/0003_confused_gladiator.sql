ALTER TABLE "borrowings" ALTER COLUMN "class" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "borrowings" ADD CONSTRAINT "class_format_check" CHECK ("borrowings"."class" ~ '^[1-6][A-D]$');