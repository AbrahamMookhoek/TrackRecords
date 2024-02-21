import { create } from "zustand";

export const useCalendarStore = create((set) => ({
  tracksOnDate: [],
  setTracksOnDate: (newTracksOnDate) => set({ tracksOnDate: newTracksOnDate }),

  events: [],
  setEvents: (newEvents) => set({ events: newEvents }),

  isEventSelected: false,
  setEventSelected: (value) => set({ isEventSelected: value }),
}));
