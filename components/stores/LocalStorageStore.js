import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const deviceTheme = Appearance.getColorScheme();

const localStorageSlice = (set, get) => ({
  theme: deviceTheme || "light",
  sortField: "frequency",
  lastDate: dayjs(),
  cardsStudied: 0,
  sessionCount: 50,
  isProgressVisible: true,
  setTheme: (newTheme) => set({ theme: newTheme }),
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    set({ theme: newTheme });
  },
  setSortField: (field) => set({ sortField: field }),
  resetStudySession: () => set({ cardsStudied: 0, lastDate: dayjs() }),
  incrementCardsStudied: () => set({ cardsStudied: get().cardsStudied + 1 }),
  setSessionCount: (count) => set({ sessionCount: count }),
  toggleProgressVisible: () =>
    set({ isProgressVisible: !get().isProgressVisible }),
});

export const useLocalStorageStore = create(
  persist(localStorageSlice, {
    name: "local-conjugo-storage",
    storage: {
      getItem: async (name) => {
        const item = await AsyncStorage.getItem(name);
        const parsed = JSON.parse(item);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            lastDate: dayjs(parsed.state.lastDate),
          },
        };
      },
      setItem: (name, state) =>
        AsyncStorage.setItem(name, JSON.stringify(state)),
      removeItem: (name) => AsyncStorage.removeItem(name),
    },
  })
);
