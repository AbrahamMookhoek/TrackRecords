import { create } from "zustand";

export const useCalendarStore = create((set) => ({
  tracks: [
    {
      trackTitle: "Track 1",
      trackArtist: "Artist 1",
      trackImg:
        "https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&",
      dateListened: "2024-02-09",
      dateAdded: "2024-02-01",
    },
    {
      trackTitle: "Track 2",
      trackArtist: "Artist 2",
      trackImg:
        "https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&",
      dateListened: "2024-02-09",
      dateAdded: "2024-02-01",
    },
    {
      trackTitle: "Track 1",
      trackArtist: "Artist 1",
      trackImg:
        "https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&",
      dateListened: "2024-02-10",
      dateAdded: "2024-02-01",
    },
    {
      trackTitle: "Track 2",
      trackArtist: "Artist 2",
      trackImg:
        "https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&",
      dateListened: "2024-02-10",
      dateAdded: "2024-02-01",
    },
    {
      trackTitle: "Track 3",
      trackArtist: "Artist 3",
      trackImg:
        "https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&",
      dateListened: "2024-02-10",
      dateAdded: "2024-02-01",
    },
    {
      trackTitle: "Track 1",
      trackArtist: "Artist 1",
      trackImg:
        "https://cdn.discordapp.com/attachments/1202397182821408909/1202397277998551150/tom_stud.jpg?ex=65cd4eba&is=65bad9ba&hm=cabe5c046cf84d485f9a44131308ebe196374caa3c5478c6dafed46252e65417&",
      dateListened: "2024-02-11",
      dateAdded: "2024-02-01",
    },
  ],
  setTracks: (newTracks) =>
    set((state) => {
      tracks: [...state.tracks, ...newTracks];
    }),

  events: [],
  setEvents: (newEvents) => set({ events: newEvents }),

  isEventSelected: false,
  setEventSelected: (value) => set({ isEventSelected: value }),
}));
