import { Playlist, Song, SongAPI } from "@/types/type";
import axios from "axios";
import { create } from "zustand";

interface PlayerStore {
  isLoading: boolean;
  error: string | null;
  songs: Song[];
  currentIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  randomSongsAPI: SongAPI[];
  playlist: Playlist | null;
  songsAPI: SongAPI[];
  currentSongAPI: SongAPI | null;
  pages: number;

  setPages:(page:number) => void;
  fetchSongs: (page:number) => Promise<void>;
  setCurrentSong: (song: SongAPI) => void;
  setIsPlaying: (value: boolean) => void;
  fetchRandomSong: () => Promise<void>;
  setPlaylist: (song: SongAPI) => Promise<void>;
  fetchPlaylist: () => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>((set,get) => ({
  isLoading: false,
  error: null,
  songs: [],
  currentIndex: -1,
  currentSong: null,
  isPlaying: false,
  randomSongsAPI: [],
  playlist: null,
  songsAPI: [],
  currentSongAPI: null,
  pages:1,

  setPages: (page) =>{
    set({pages: page })
  },

  fetchSongs: async (page) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(
        "https://v2-api-kaito-music.vercel.app/api/music/top-views",
        {
          params: { _limit: 20, _page: page, _type: "million" },
        }
      );

      set({ songsAPI: res.data.data, pages:page });
    } catch (error: any) {
      console.log("fetchSongs store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentSong: (song) => {
    // console.log("current: ",song)
    set({ currentSongAPI: song, isPlaying: true });
  },

  setIsPlaying: (value) => {
    set({ isPlaying: value });
  },

  fetchRandomSong: async () => {
    set({ isLoading: true, error: null });
    try {
      let randomPage = Math.floor(Math.random() * 15) +1;
      const res = await axios.get(
        "https://v2-api-kaito-music.vercel.app/api/music/top-views",
        {
          params: { _limit: 20, _page: randomPage, _type: "million" },
        }
      );
      // console.log(res.data.data);
      set({ randomSongsAPI: res.data.data });
    } catch (error: any) {
      console.log("randomSongsAPI store error", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setPlaylist: async (song) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post("/api/playlists", { song });
      console.log(res.data)
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
      const res = await axios.delete("/api/playlists", { data: { songId } });
      set({ playlist: res.data.playlist });
    } catch (error: any) {
      console.log("deleteSong store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
