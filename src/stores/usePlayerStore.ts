import { Playlist, Song } from "@/types/type";
import axios from "axios";
import { create } from "zustand";

interface PlayerStore {
  isLoading: boolean;
  error: string | null;
  songs: Song[];
  currentIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  randomSongs: Song[];
  playlist: Playlist | null;

  fetchSongs: () => Promise<void>;
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (value: boolean) => void;
  fetchRandomSong: () => Promise<void>;
  setPlaylist: (song: string) => Promise<void>;
  fetchPlaylist: () => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isLoading: false,
  error: null,
  songs: [],
  currentIndex: -1,
  currentSong: null,
  isPlaying: false,
  randomSongs: [],
  playlist: null,

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/songs");
      // console.log(res.data.songs);
      set({ songs: res.data.songs });
    } catch (error: any) {
      console.log("fetchSongs store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentSong: async (song) => {
    set({ currentSong: song, isPlaying: true });
  },

  setIsPlaying: async (value) => {
    set({ isPlaying: value });
  },

  fetchRandomSong: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/songs/random");
      set({ randomSongs: res.data.songs });
    } catch (error: any) {
      console.log("randomSongs store error", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setPlaylist: async (song) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post("/api/playlists", { songId: song });

      set({ playlist: res.data.playlist });
    } catch (error: any) {
      console.log("setPlaylist store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylist: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/playlists");

      set({ playlist: res.data.playlist });
    } catch (error: any) {
      console.log("fetchPlaylist store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (songId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.delete("/api/playlists", { data: {songId} });
      set({ playlist: res.data.playlist });
    } catch (error: any) {
      console.log("deleteSong store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
