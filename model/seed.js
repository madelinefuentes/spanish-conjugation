import { watermelondb } from "./db";
import { Q } from "@nozbe/watermelondb";
import hablar from "../data/hablar.json";
import estar from "../data/estar.json";
import ser from "../data/ser.json";
import ir from "../data/ir.json";
import tener from "../data/tener.json";

const verbFiles = [hablar, estar, ser, ir, tener];

export async function seedDatabase() {
  const verbCollection = database.get("verbs");
  const conjugationCollection = database.get("conjugations");
  const reviewCollection = database.get("srs_reviews");

  for (const data of verbFiles) {
    // create verb
    await watermelondb.write(async () => {
      const existingVerb = await verbCollection
        .query(Q.where("infinitive", data.infinitive))
        .fetch();

      if (existingVerb.length > 0) {
        console.log(`skipped existing verb: ${data.infinitive}`);
        return;
      }

      // add new verb
      const newVerb = await verbCollection.create((v) => {
        v.infinitive = data.infinitive;
        v.meaning = data.meaning;
        v.type = data.type;
        v.group = data.group;
        v.status = "new";
      });

      // insert all conjugations
      for (const [mood, tenses] of Object.entries(data.conjugations)) {
        for (const [tense, persons] of Object.entries(tenses)) {
          for (const [person, details] of Object.entries(persons)) {
            const conjugation = await conjugationCollection.create((c) => {
              c.verb_id = newVerb.id;
              c.mood = mood;
              c.tense = tense;
              c.person = person;
              c.conjugation = details.conjugation;
              c.translation = details.translation;
            });

            // Default SRS review state (FSRS-friendly)
            await reviewCollection.create((r) => {
              r.conjugation_id = conjugation.id;
              r.stability = 0;
              r.difficulty = 0;
              r.elapsed_days = 0;
              r.scheduled_days = 0;
              r.reps = 0;
              r.lapses = 0;
              r.state = "new";
              r.last_review_at = Date.now();
            });
          }
        }
      }
    });

    console.log(`seeded verb: ${data.infinitive}`);
  }

  console.log("Database seeded.");
}
