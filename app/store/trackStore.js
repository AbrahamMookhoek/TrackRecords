import { create } from 'zustand'

export const useTrackStore = create((set) => ({
    tracks: [],
    setTracks: (newTracks) => set((state) => ({tracks: newTracks}))
}))