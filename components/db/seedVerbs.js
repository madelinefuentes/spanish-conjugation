import { db } from "./client";
import { verbs, conjugations, srsReviews } from "./schema";
import conjugatedVerbs from "../../scripts/conjugated_verbs.json";
import { State } from "ts-fsrs";

export const seedVerbs = () => {
  for (const verb of conjugatedVerbs) {
    // console.log(verb.infinitive);
    seedVerbFromJson(verb);
  }
};

const seedVerbFromJson = async (verbData) => {
  console.log(`Seeding: ${verbData.infinitive}`);

  try {
    // Step 1: Insert verb
    const [insertedVerb] = await db
      .insert(verbs)
      .values({
        infinitive: verbData.infinitive,
        meaning: verbData.meaning,
        type: verbData.type,
        group: "group", // TODO remove
        status: "new",
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
            difficulty: 0,
            dueAt: new Date(),
            elapsedDays: 0,
            lapses: 0,
            // lastReviewAt: null,
            learningSteps: 0,
            reps: 0,
            scheduledDays: 0,
            stability: 0,
            state: State.New,
          });
        }
      }
    }

    console.log(`Successfully seeded: ${verbData.infinitive}`);
  } catch (error) {
    console.log(`Error seeding db with verb: ${error}`);
  }
};
