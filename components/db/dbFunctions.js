import { db } from "../db/client";
import { conjugations, verbs, srsReviews } from "../db/schema";
import { desc, eq, isNull, lte } from "drizzle-orm";

export const getStudySessionCards = async (numCards) => {
  try {
    const now = Math.floor(Date.now() / 1000);

    const dueCards = await db
      .select({
        id: conjugations.id,
        mood: conjugations.mood,
        tense: conjugations.tense,
        person: conjugations.person,
        conjugation: conjugations.conjugation,
        translation: conjugations.translation,
        infinitive: verbs.infinitive,
        meaning: verbs.meaning,
      })
      .from(srsReviews)
      .innerJoin(conjugations, eq(srsReviews.conjugationId, conjugations.id))
      .innerJoin(verbs, eq(verbs.id, conjugations.verbId))
      .where(lte(srsReviews.dueAt, now))
      .orderBy(srsReviews.dueAt)
      .limit(numCards);

    const remaining = numCards - dueCards.length;

    let newCards = [];
    if (remaining > 0) {
      newCards = await db
        .select({
          id: conjugations.id,
          mood: conjugations.mood,
          tense: conjugations.tense,
          person: conjugations.person,
          conjugation: conjugations.conjugation,
          translation: conjugations.translation,
          infinitive: verbs.infinitive,
          meaning: verbs.meaning,
        })
        .from(conjugations)
        .leftJoin(srsReviews, eq(srsReviews.conjugationId, conjugations.id))
        .innerJoin(verbs, eq(verbs.id, conjugations.verbId))
        .where(isNull(srsReviews.id))
        .orderBy(desc(verbs.frequency))
        .limit(remaining);
    }

    return [...dueCards, ...newCards];
  } catch (error) {
    console.error("Error in getStudySessionCards:", error);
  }
};

export const getConjugationsByVerb = () => {};

export const getConjugationsByVerbAndTense = () => {};
