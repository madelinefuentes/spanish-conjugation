import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const verbs = sqliteTable("verbs", {
  id: integer("id").primaryKey({ autoIncrement: true }), // autogenerate primary key for now
  infinitive: text("infinitive").notNull(),
  meaning: text("meaning"),
  type: text("type"),
  frequency: real("frequency").default(0),
  participleEs: text("participle_es"),
  participleEn: text("participle_en"),
  gerundEs: text("gerund_es"),
  gerundEn: text("gerund_en"),
});

export const conjugations = sqliteTable("conjugations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  verbId: integer("verb_id")
    .notNull()
    .references(() => verbs.id),
  mood: text("mood").notNull(),
  tense: text("tense").notNull(),
  person: text("person").notNull(),
  esForm: text("es_form").notNull(),
  enForm: text("en_form"),
});

export const srsReviews = sqliteTable("srs_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conjugationId: integer("conjugation_id")
    .notNull()
    .references(() => conjugations.id),
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
