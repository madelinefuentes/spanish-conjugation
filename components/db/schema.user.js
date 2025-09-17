import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const srsReviews = sqliteTable("srs_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conjugationId: integer("conjugation_id").notNull(),
  dueAt: integer("due_at").notNull(),
  stability: integer("stability").notNull(),
  difficulty: integer("difficulty").notNull(),
  scheduledDays: integer("scheduled_days").notNull(),
  learningSteps: integer("learning_steps").notNull(),
  reps: integer("reps").notNull(),
  lapses: integer("lapses").notNull(),
  state: text("state").notNull(),
  lastReviewAt: integer("last_review_at"),
});
