import { Playlist, Song, SongAPI } from "@/types/type";
import axios from "axios";
import { create } from "zustand";

interface PlayerStore {
  isLoading: {
    songs: boolean,
    search: boolean,
    random: boolean,
    playlist: boolean,
  };
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
  searchResults: SongAPI[];
  searchQuery: string;

  setPages: (page: number) => void;
  fetchSongs: (page: number) => Promise<void>;
  fetchSearch: (query: string, page: number) => Promise<void>;
  setCurrentSong: (song: SongAPI) => void;
  setIsPlaying: (value: boolean) => void;
  fetchRandomSong: () => Promise<void>;
  setPlaylist: (song: SongAPI) => Promise<void>;
  fetchPlaylist: () => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isLoading: {
    songs: false,
    search: false,
    random: false,
    playlist: false,
  },
  error: null,
  songs: [],
  currentIndex: -1,
  currentSong: null,
  isPlaying: false,
  randomSongsAPI: [],
  playlist: null,
  songsAPI: [],
  currentSongAPI: null,
  pages: 1,
  searchResults: [],
  searchQuery: "",

  setPages: (page) => {
    set({ pages: page });
  },

  fetchSongs: async (page) => {
    set((state) => ({
      isLoading: { ...state.isLoading, songs: true },
      error: null,
    }));
    try {
      const res = await axios.get(
        "https://v2-api-kaito-music.vercel.app/api/music/top-views",
        {
          params: { _limit: 20, _page: page, _type: "million" },
        }
      );

      set({ songsAPI: res.data.data, pages: page });
    } catch (error: any) {
      console.log("fetchSongs store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, songs: false } }));
    }
  },

  fetchSearch: async (query, page = 1) => {
    set((state) => ({
      isLoading: { ...state.isLoading, search: true },
      searchQuery: query,
    }));
    try {
      const res = await axios.get(
        "https://v2-api-kaito-music.vercel.app/api/search",
        {
          params: {
            query,
            _limit: 20,
            _page: page,
          },
        }
      );

      set({
        searchResults: res.data.data,
        pages: page,
      });
    } catch (error: any) {
      console.log("Search error:", error);
      set({ error: error?.response?.data?.message || "Search failed" });
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, search: false } }));
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
    set((state) => ({
      isLoading: { ...state.isLoading, random: true },
      error: null,
    }));
    try {
      let randomPage = Math.floor(Math.random() * 15) + 1;
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
      set((state) => ({
        isLoading: { ...state.isLoading, random: false },
      }));
    }
  },

  setPlaylist: async (song) => {
    set((state) => ({
      isLoading: { ...state.isLoading, playlist: true },
      error: null,
    }));
    try {
      const res = await axios.post("/api/playlists", { song });
      console.log(res.data);
      set({ playlist: res.data.playlist });
    } catch (error: any) {
      console.log("setPlaylist store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, playlist: false },
      }));
    }
  },

  fetchPlaylist: async () => {
    set((state) => ({
      isLoading: { ...state.isLoading, playlist: true },
      error: null,
    }));
    try {
      const res = await axios.get("/api/playlists");

      set({ playlist: res.data.playlist });
    } catch (error: any) {
      console.log("fetchPlaylist store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, playlist: false },
      }));
    }
  },

  deleteSong: async (songId) => {
    set((state) => ({
      isLoading: { ...state.isLoading, songs: true },
      error: null,
    }));
    try {
      const res = await axios.delete("/api/playlists", { data: { songId } });
      set({ playlist: res.data.playlist });
    } catch (error: any) {
      console.log("deleteSong store error: ", error);
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, songs: false },
      }));
    }
  },
}));
