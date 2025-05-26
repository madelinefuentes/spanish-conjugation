import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "verbs",
      columns: [
        { name: "infinitive", type: "string" },
        { name: "meaning", type: "string" },
        { name: "type", type: "string" },
        { name: "group", type: "string" },
        { name: "status", type: "string" }, // new, learning, mastered
      ],
    }),
    tableSchema({
      name: "conjugations",
      columns: [
        { name: "verb_id", type: "string", isIndexed: true },
        { name: "mood", type: "string" }, // 'indicative'
        { name: "tense", type: "string" }, // 'present'
        { name: "person", type: "string" }, // 'yo', 'tú'
        { name: "conjugation", type: "string" }, // 'hablo'
        { name: "translation", type: "string" }, // 'I speak'
      ],
    }),
    tableSchema({
      name: "srs_reviews",
      columns: [
        { name: "conjugation_id", type: "string", isIndexed: true },

        // FSRS fields
        { name: "stability", type: "number" },
        { name: "difficulty", type: "number" },
        { name: "elapsed_days", type: "number" },
        { name: "scheduled_days", type: "number" },
        { name: "reps", type: "number" },
        { name: "lapses", type: "number" },
        { name: "state", type: "string" }, // new, learning, review, relearning
        { name: "last_review_at", type: "number" }, // timestamp
      ],
    }),
  ],
});
