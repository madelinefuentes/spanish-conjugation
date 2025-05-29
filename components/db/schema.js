import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const verbs = sqliteTable("verbs", {
  id: integer("id").primaryKey({ autoIncrement: true }), // autogenerate primary key for now
  infinitive: text("infinitive").notNull(),
  meaning: text("meaning").notNull(),
  type: text("type").notNull(),
  group: text("group").notNull(),
  status: text("status").notNull(), // new, learning, mastered
});

export const conjugations = sqliteTable("conjugations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  verbId: integer("verb_id")
    .notNull()
    .references(() => verbs.id),
  mood: text("mood").notNull(),
  tense: text("tense").notNull(),
  person: text("person").notNull(),
  conjugation: text("conjugation").notNull(),
  translation: text("translation").notNull(),
});

export const srsReviews = sqliteTable("srs_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conjugationId: integer("conjugation_id")
    .notNull()
    .references(() => conjugations.id),

  dueAt: integer("due_at").notNull(),
  stability: integer("stability").notNull(),
  difficulty: integer("difficulty").notNull(),
  elapsedDays: integer("elapsed_days").notNull(),
  scheduledDays: integer("scheduled_days").notNull(),
  learningSteps: integer("learning_steps").notNull(),
  reps: integer("reps").notNull(),
  lapses: integer("lapses").notNull(),
  state: text("state").notNull(),
  lastReviewAt: integer("last_review_at"),
});
