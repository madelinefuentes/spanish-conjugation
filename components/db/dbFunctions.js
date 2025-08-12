import { db } from "../db/client";
import { conjugations, verbs, srsReviews } from "../db/schema";
import { and, desc, eq, isNull, lte } from "drizzle-orm";

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

export const getConjugationsByVerb = async (verbId) => {
  return await db
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
    .innerJoin(verbs, eq(verbs.id, conjugations.verbId))
    .where(eq(conjugations.verbId, verbId));
};

export const getConjugationsByVerbAndTense = async (verbId, tense) => {
  return await db
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
    .innerJoin(verbs, eq(verbs.id, conjugations.verbId))
    .where(and(eq(conjugations.verbId, verbId), eq(conjugations.tense, tense)));
};
