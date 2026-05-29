ALTER TABLE "borrowings" DROP CONSTRAINT "class_format_check";--> statement-breakpoint
ALTER TABLE "borrowings" ALTER COLUMN "class" SET DATA TYPE "public"."class_name" USING "class"::"public"."class_name";--> statement-breakpoint
ALTER TABLE "equipments" ALTER COLUMN "picture" SET DATA TYPE text;