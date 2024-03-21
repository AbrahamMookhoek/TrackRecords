import { create } from "zustand";

export const useTrackStore = create((set) => ({
  addedTracks: [],
  setAddedTracks: (newAddedTracks) => set({ addedTracks: newAddedTracks }),

  listenedTracks: [],
  setListenedTracks: (newListenedTracks) =>
    set({ listenedTracks: newListenedTracks }),
}));
