import { ProgressBar } from "./ProgressBar";
import { PracticeCard } from "./PracticeCard";
import { useEffect, useState } from "react";
import { useLocalStorageStore } from "../stores/LocalStorageStore";
import { getStudySessionCards } from "../db/dbFunctions";

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
