import { ProgressBar } from "./ProgressBar";
import { PracticeCard } from "./PracticeCard";
import { useEffect, useState } from "react";
import { useLocalStorageStore } from "../stores/LocalStorageStore";
import { getStudySessionCards } from "../db/dbFunctions";
import dayjs from "dayjs";

const SESSION_COUNT = 20;

export const PracticeScreen = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsStudied = useLocalStorageStore((state) => state.cardsStudied);
  const sessionCount = useLocalStorageStore((state) => state.sessionCount);
  const lastDate = useLocalStorageStore((state) => state.lastDate);
  const resetStudySession = useLocalStorageStore(
    (state) => state.resetStudySession
  );

  const resetDaily = async () => {
    if (lastDate.isBefore(dayjs(), "day")) {
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
      <ProgressBar cardsStudied={cardsStudied} sessionCount={sessionCount} />
      <PracticeCard item={cards[currentIndex]} incrementCard={incrementCard} />
    </>
  );
};

PracticeScreen.whyDidYouRender = true;
