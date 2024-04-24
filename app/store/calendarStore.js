import { create } from "zustand";

export const useCalendarStore = create((set) => ({
  addedTracksOnDate: [],
  setAddedTracksOnDate: (newAddedTracksOnDate) =>
    set({ addedTracksOnDate: newAddedTracksOnDate }),

  listenedTracksOnDate: [],
  setListenedTracksOnDate: (newListenedTracksOnDate) =>
    set({ listenedTracksOnDate: newListenedTracksOnDate }),

  dateSelected: "",
  setDateSelected: (newDate) => set({ dateSelected: newDate }),

  events: [],
  setEvents: (newEvents) => set({ events: newEvents }),

  isEventSelected: false,
  setEventSelected: (value) => set({ isEventSelected: value }),

  filteredPlaylists: [],
  setFilteredPlaylists: (value) => set({ filteredPlaylists: value }),
}));
