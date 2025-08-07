import { create } from "zustand";

export const useModalStore = create((set) => ({
  isTaskFormOpen: false,
  setIsTaskFromOpen: (visible) => set({ isTaskFormOpen: visible }),
  modals: {
    WRONG_ANSWER: { isVisible: false, props: {} },
  },
  openModal: (type, props = {}) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [type]: { isVisible: true, props },
      },
    })),
  closeModal: (type) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [type]: {
          ...state.modals[type],
          isVisible: false,
        },
      },
    })),
}));
