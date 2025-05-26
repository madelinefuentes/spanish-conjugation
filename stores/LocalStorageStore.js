import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceTheme = Appearance.getColorScheme();

const localStorageSlice = (set, get) => ({
  theme: deviceTheme || "light",
  setTheme: (newTheme) => set({ theme: newTheme }),
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    set({ theme: newTheme });
  },
});

export const useLocalStorageStore = create(
  persist(localStorageSlice, {
    name: "local-conjugo-storage",
    storage: createJSONStorage(() => AsyncStorage),
  })
);
