import { ProgressBar } from "./ProgressBar";
import { PracticeCard } from "./PracticeCard";
import { db } from "../db/client";
import { conjugations, verbs, srsReviews } from "../db/schema";
import { useEffect, useState } from "react";

const testItem = {
  english: "you spoke",
  subject: "tú",
  tense: "preterite",
  correctAnswer: "hablé",
};

export const PracticeScreen = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const result = await getStudySessionCards(5);
      setCards(result);
    };

    fetchCards();
  }, []);

  console.log(cards);

  const handleResult = (isCorrect) => {
    // alert(isCorrect ? "Correct!" : "Wrong, Try Again");
  };

  return (
    <>
      <ProgressBar />
      <PracticeCard item={testItem} onSubmit={handleResult} />
    </>
  );
};

PracticeScreen.whyDidYouRender = true;

export const getStudySessionCards = async (numCards) => {
  const now = Date.now();

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
};
