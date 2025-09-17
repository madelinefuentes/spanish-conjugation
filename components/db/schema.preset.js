import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const tenses = sqliteTable("tenses", {
  id: integer("id").primaryKey(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  mood: text("mood").notNull(),
  description: text("description"),
});

export const verbs = sqliteTable("verbs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  verbId: integer("verb_id").notNull(),
  mood: text("mood").notNull(),
  tense: text("tense").notNull(),
  person: text("person").notNull(),
  esForm: text("es_form").notNull(),
  enForm: text("en_form").notNull(),
});
