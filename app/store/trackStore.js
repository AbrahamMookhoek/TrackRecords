import { create } from "zustand";

export const useTrackStore = create((set) => ({
  tracks: [],
  setTracks: (newTracks) => set({ tracks: newTracks }),
}));
