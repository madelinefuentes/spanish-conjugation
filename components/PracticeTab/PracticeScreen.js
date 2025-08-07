import { ProgressBar } from "./ProgressBar";
import { PracticeCard } from "./PracticeCard";
import { db } from "../db/client";
import { conjugations, verbs, srsReviews } from "../db/schema";
import { useEffect, useState } from "react";
import { desc, eq, isNull, lte } from "drizzle-orm";
import { useLocalStorageStore } from "../stores/LocalStorageStore";

const SESSION_COUNT = 20;

export const PracticeScreen = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const lastDate = useLocalStorageStore((state) => state.lastDate);
  const resetStudySession = useLocalStorageStore(
    (state) => state.resetStudySession
  );

  const resetDaily = async () => {
    const today = dayjs();

    if (lastDate.isBefore(today, "day")) {
      resetStudySession();
    }
  };

  const fetchCards = async () => {
    const result = await getStudySessionCards(SESSION_COUNT);
    setCards(result);
  };

  useEffect(() => {
    resetDaily();
    fetchCards();
  }, []);

  const incrementCard = async () => {
    if (currentIndex == cards.length - 1) {
      const result = await getStudySessionCards(SESSION_COUNT);
      setCards(result);
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <>
      <ProgressBar />
      <PracticeCard item={cards[currentIndex]} incrementCard={incrementCard} />
    </>
  );
};

PracticeScreen.whyDidYouRender = true;

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
