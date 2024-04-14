import { create } from "zustand";

export const useEntryStore = create((set) => ({
  entries: [],
  setEntries: (newEntries) => set({ entries: newEntries }),

  updateFunc: null,
  setUpdateFunc: (fn) => set({ updateFunc: fn }),
  callUpdateFunc: (...entry) => {
    set((state) => {
      if (state.updateFunc) {
        return { ...state, result: state.updateFunc(...entry) };
      }
      return state;
    });
  },
}));
