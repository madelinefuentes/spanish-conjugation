# Spanish Conjugation App

A mobile app built with **Expo React Native** for Spanish verb practice. It includes conjugation tables and a spaced-repetition review loop that prioritizes cards by frequency and your progress. Data is stored locally with SQLite (Drizzle ORM) and state is managed with Zustand.

<div style="display: flex; gap: 10px; justify-content: center;">
  <img src="https://github.com/user-attachments/assets/b2cef869-19f6-43b8-bb5b-67c8a460bc06" alt="Verb list" height="500" />
  <img src="https://github.com/user-attachments/assets/cf5deb8c-9c27-4073-bddf-b9943215d87d" alt="Conjugation" height="500" />
  <img src="https://github.com/user-attachments/assets/e7c6a6b2-8974-420e-83c5-4a74480bf25e" alt="Study session" height="500" />
</div>

## Features
- Browse verbs with translations and conjugation tables.
- Practice with flashcards ordered by verb frequency and your progress.
- Spaced repetition scheduling using **ts-fsrs**.
- Local storage with **Drizzle ORM** and **SQLite**.
- State management with **Zustand**.
- Dark and light theme.

## Tech Stack
- Expo React Native 
- Zustand
- Drizzle ORM + SQLite
- ts-fsrs
- React Navigation
- Emotion
- Reanimated
