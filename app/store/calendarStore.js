import { create } from "zustand";

export const useCalendarStore = create((set) => ({
  tracks: [],
  setTracks: (tracksOnDate) => set((state) => { tracks: tracksOnDate}),

  trackDateMap: new Map(),
  setTrackMap: (trackMap) => set((state) => { trackDateMap: trackMap}),

  events: [],
  setEvents: (newEvents) => set({ events: newEvents }),

  isEventSelected: false,
  setEventSelected: (value) => set({ isEventSelected: value }),
}));
