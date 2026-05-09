CREATE INDEX "equipment_idx" ON "borrowings" USING btree ("equipment_id");--> statement-breakpoint
CREATE INDEX "class_idx" ON "borrowings" USING btree ("class");