import { SongAPI } from "@/types/type";
import { create } from "zustand";

interface PlayerStore {
  volume: number;
  isRepeat: boolean;
  isRandom: boolean;
  lastPlayedSongId: string | null;
  isPlaying: boolean;
  songsAPI: SongAPI[];
  currentSongAPI: SongAPI | null;

  setIsPlaying: (value: boolean) => void;
  setCurrentSong: (song: SongAPI) => void;
  setVolume: (value: number) => void;
  setRepeat: (value: boolean) => void;
  setRandom: (value: boolean) => void;
  hydrateFromStorage: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  volume: 75,
  isRepeat: false,
  isRandom: false,
  lastPlayedSongId: null,
  isPlaying: false,
  songsAPI: [],
  currentSongAPI: null,

  setCurrentSong: (song) => {
    sessionStorage.setItem("currentSong", JSON.stringify(song));
    set({ currentSongAPI: song, isPlaying: true });
  },

  setIsPlaying: (value) => {
    set({ isPlaying: value });
  },

  setVolume: (value) => {
    localStorage.setItem("volume", JSON.stringify(value));
    set({ volume: value });
  },

  setRepeat: (value) => {
    localStorage.setItem("isRepeat", JSON.stringify(value));
    set({ isRepeat: value });
  },

  setRandom: (value) => {
    localStorage.setItem("isRandom", JSON.stringify(value));
    set({ isRandom: value });
  },

  hydrateFromStorage: () => {
    const volume = localStorage.getItem("volume");
    const isRepeat = localStorage.getItem("isRepeat");
    const isRandom = localStorage.getItem("isRandom");
    const currentSong = sessionStorage.getItem("currentSong");
    set({
      volume: volume ? JSON.parse(volume) : 75,
      isRepeat: isRepeat ? JSON.parse(isRepeat) : false,
      isRandom: isRandom ? JSON.parse(isRandom) : false,
      currentSongAPI: currentSong ? JSON.parse(currentSong) : null,
    });
  },
}));
