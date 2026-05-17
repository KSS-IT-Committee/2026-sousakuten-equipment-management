CREATE TYPE "public"."class_name" AS ENUM('1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', '5D', '6A', '6B', '6C', '6D');--> statement-breakpoint
CREATE TABLE "deductions" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_name" "class_name" NOT NULL,
	"content" text NOT NULL,
	"points" integer NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
