import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const cities = sqliteTable("cities", {
  id: text("id").primaryKey().unique(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  touristRating: integer("tourist_rating"),
  dateEstablished: text("date_established"),
  estimatedPopulation: integer("estimated_population").notNull(),
  createdAt: integer("created_at").notNull(),
});
