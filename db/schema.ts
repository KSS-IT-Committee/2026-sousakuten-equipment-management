import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const Equipments = pgTable(
  "equipments",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    picture: text("picture"),
  },
  (table) => [check("quantity_positive", sql`${table.quantity} > 0`)],
);

export const Borrowings = pgTable(
  "borrowings",
  {
    id: serial("id").primaryKey(),
    equipmentId: integer("equipment_id")
      .notNull()
      .references(() => Equipments.id),
    // tagNumber: integer("tag_number").notNull(),
    class: integer("class").notNull(),
    borrowedAt: timestamp("borrowed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    returnedAt: timestamp("returned_at", { withTimezone: true }),
  },
  (table) => [
    index("equipment_idx").on(table.equipmentId),
    index("class_idx").on(table.class),
    check(
      "returned_at_after_borrowed_at",
      sql`${table.returnedAt} IS NULL OR ${table.returnedAt} >= ${table.borrowedAt}`,
    ),
  ],
);
