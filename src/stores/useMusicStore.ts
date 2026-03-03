import { getChatHistory, reqChatbot } from "@/lib/actions/chatbot-actions";
import {
  addToPlaylist,
  removeFromPlaylist,
} from "@/lib/actions/playlists-actions";
import { Message, Playlist, Song, SongAPI } from "@/types/type";
import { create } from "zustand";

interface MusicStore {
  isLoading: {
    songs: boolean;
  };
  error: string | null;
  songsAPI: SongAPI[];

  setSongsAPI: (songs: SongAPI[]) => void;

}

export const useMusicStore = create<MusicStore>((set, get) => ({
  isLoading: {
    songs: false,
  },
  error: null,
  songsAPI: [],

  setSongsAPI: (songs) => {
    set({ songsAPI: songs });
  },
}));
