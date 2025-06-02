import { ProgressBar } from "./ProgressBar";
import { PracticeCard } from "./PracticeCard";

const testItem = {
  english: "you spoke",
  subject: "yo",
  tense: "preterite - indicative",
  correctAnswer: "hablé",
};

export const PracticeScreen = () => {
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
