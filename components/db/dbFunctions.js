// services/study.js
import { presetDb, userDb } from "../db/client";
import { conjugations, verbs } from "../db/schema.preset";
import { srsReviews } from "../db/schema.user";
import { and, desc, eq, lte, inArray, notInArray } from "drizzle-orm";

async function getConjugationCardsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  return await presetDb
    .select({
      id: conjugations.id,
      mood: conjugations.mood,
      tense: conjugations.tense,
      person: conjugations.person,
      conjugation: conjugations.esForm,
      translation: conjugations.enForm,
      infinitive: verbs.infinitive,
      meaning: verbs.meaning,
    })
    .from(conjugations)
    .innerJoin(verbs, eq(verbs.id, conjugations.verbId))
    .where(inArray(conjugations.id, ids));
}

export const getStudySessionCards = async (numCards) => {
  try {
    const now = Math.floor(Date.now() / 1000);

    const due = await userDb
      .select({
        conjugationId: srsReviews.conjugationId,
        dueAt: srsReviews.dueAt,
      })
      .from(srsReviews)
      .where(lte(srsReviews.dueAt, now))
      .orderBy(srsReviews.dueAt)
      .limit(numCards);

    const dueIds = due.map((d) => d.conjugationId);
    const dueCards = await getConjugationCardsByIds(dueIds);

    const remaining = numCards - dueCards.length;

    let newCards = [];
    if (remaining > 0) {
      const reviewedRows = await userDb
        .select({ conjugationId: srsReviews.conjugationId })
        .from(srsReviews);

      const reviewedIds = Array.from(
        new Set(reviewedRows.map((r) => r.conjugationId))
      );

      newCards = await presetDb
        .select({
          id: conjugations.id,
          mood: conjugations.mood,
          tense: conjugations.tense,
          person: conjugations.person,
          conjugation: conjugations.esForm,
          translation: conjugations.enForm,
          infinitive: verbs.infinitive,
          meaning: verbs.meaning,
        })
        .from(conjugations)
        .innerJoin(verbs, eq(verbs.id, conjugations.verbId))
        .where(notInArray(conjugations.id, reviewedIds))
        .orderBy(desc(verbs.frequency))
        .limit(remaining);
    }

    return [...dueCards, ...newCards];
  } catch (error) {
    console.error("Error in getStudySessionCards:", error);
    return [];
  }
};

export const getConjugationsByVerb = async (verbId) => {
  return await presetDb
    .select({
      id: conjugations.id,
      mood: conjugations.mood,
      tense: conjugations.tense,
      person: conjugations.person,
      conjugation: conjugations.esForm,
      translation: conjugations.enForm,
      infinitive: verbs.infinitive,
      meaning: verbs.meaning,
    })
    .from(conjugations)
    .innerJoin(verbs, eq(verbs.id, conjugations.verbId))
    .where(eq(conjugations.verbId, verbId));
};

export const getConjugationsByVerbAndTense = async (verbId, tense) => {
  return await presetDb
    .select({
      id: conjugations.id,
      mood: conjugations.mood,
      tense: conjugations.tense,
      person: conjugations.person,
      conjugation: conjugations.esForm,
      translation: conjugations.enForm,
      infinitive: verbs.infinitive,
      meaning: verbs.meaning,
    })
    .from(conjugations)
    .innerJoin(verbs, eq(verbs.id, conjugations.verbId))
    .where(and(eq(conjugations.verbId, verbId), eq(conjugations.tense, tense)));
};
