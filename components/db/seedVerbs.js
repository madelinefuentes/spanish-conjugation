import { db } from "./client";
import { verbs, conjugations, srsReviews } from "./schema";
import { createEmptyCard } from "ts-fsrs";

export const seedVerbs = () => {
  const card = createEmptyCard();
  console.log(card);
};

const seedVerbFromJson = async (verbData) => {
  // Step 1: Insert verb
  const [insertedVerb] = await db
    .insert(verbs)
    .values({
      infinitive: verbData.infinitive,
      meaning: verbData.meaning,
      type: verbData.type,
      group: verbData.group,
      status: verbData.status ?? "new",
    })
    .returning({ id: verbs.id });

  const verbId = insertedVerb.id;

  // Step 2: Insert conjugations and linked SRS records
  for (const mood in verbData.conjugations) {
    const tenses = verbData.conjugations[mood];

    for (const tense in tenses) {
      const persons = tenses[tense];

      for (const person in persons) {
        const entry = persons[person];

        // Insert conjugation
        const [conjugationRow] = await db
          .insert(conjugations)
          .values({
            verbId,
            mood,
            tense,
            person,
            conjugation: entry.conjugation,
            translation: entry.translation,
          })
          .returning({ id: conjugations.id });

        const conjugationId = conjugationRow.id;

        // Insert SRS review
        await db.insert(srsReviews).values({
          conjugationId,
          stability: 0,
          difficulty: 0,
          elapsedDays: 0,
          scheduledDays: 0,
          reps: 0,
          lapses: 0,
          state: "new",
          lastReviewAt: 0,
        });
      }
    }
  }

  console.log(`Seeded: ${verbData.infinitive}`);
};
