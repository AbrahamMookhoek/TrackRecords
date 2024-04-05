import { create } from "zustand";

export const useEntryStore = create((set) => ({
  entries: [],
  addEntry: (newEntry) =>
    set((state) => ({ entries: state.entries.concat(newEntry) })),

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
