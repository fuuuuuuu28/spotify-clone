import { getChatHistory, reqChatBot } from "@/lib/actions/chatbot-actions";
import {
  addToPlaylist,
  removeFromPlaylist,
} from "@/lib/actions/playlists-actions";
import { Message, Playlist, Song, SongAPI } from "@/types/type";
import { create } from "zustand";

interface MusicStore {
  isLoading: {
    songs: boolean;
    search: boolean;
    random: boolean;
    playlistAdd: boolean;
    playlistDelete: {
      deleting: boolean;
      deletingSongId: string | null;
    };
    playlistFetch: {
      fetching: boolean;
      duplicated: boolean;
      duplicatedSongId: string | null;
      addingSongId: string | null;
    };
    chatbot: {
      fetching: boolean;
      sending: boolean;
    };
  };
  error: string | null;
  songsAPI: SongAPI[];
  playlist: Playlist | null;
  messages: Message[];

  setSongsAPI: (songs: SongAPI[]) => void;

  setPlaylist: (playlist: Playlist) => void;
  addPlaylistSong: (song: SongAPI) => Promise<void>;
  deletePlaylistSong: (songId: string) => Promise<void>;

  askToChatbot: (prompt: string) => Promise<void>;
  loadChatHistory: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  isLoading: {
    songs: false,
    search: false,
    random: false,
    playlistAdd: false,
    playlistDelete: {
      deleting: false,
      deletingSongId: null,
    },
    playlistFetch: {
      fetching: false,
      duplicated: false,
      duplicatedSongId: null,
      addingSongId: null,
    },
    chatbot: {
      fetching: false,
      sending: false,
    },
  },
  error: null,
  songsAPI: [],
  playlist: null,
  messages: [],

  setSongsAPI: (songs) => {
    set({ songsAPI: songs });
  },

  setPlaylist: (playlist) => set({ playlist }),

  addPlaylistSong: async (song) => {
    const prevPlaylist = get().playlist;
    if(!prevPlaylist) return;
    set({
      playlist:{
        ...prevPlaylist,
        songs:[...prevPlaylist?.songs, song],
      },
      isLoading:{
        ...get().isLoading,
        playlistFetch:{
          ...get().isLoading.playlistFetch,
          addingSongId:song._id
        }
      }
    })
    try {
      const res = await addToPlaylist(song);
      if (!prevPlaylist) return;

      if (res === "Already have this song") {
        set({ playlist:prevPlaylist})
        return;
      }
    } catch (error: any) {
      console.log("addPlaylistSong store error: ", error)
      set({
        playlist: prevPlaylist,
        error: error.message,
      });
    } finally {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          playlistAdd: false,
          playlistFetch: {
            ...state.isLoading.playlistFetch,
            addingSongId: null,
          },
        },
      }));
    }
  },

  deletePlaylistSong: async (songId) => {
    const prevPlaylist = get().playlist;
    if(!prevPlaylist) return;

    set({ 
      playlist:{
        ...prevPlaylist,
        songs:prevPlaylist.songs.filter(s => s._id !== songId),
      },
      isLoading:{
        ...get().isLoading,
        playlistDelete:{
          deleting:true,
          deletingSongId:songId,
        }
      }
    })
    try {
      await removeFromPlaylist(songId);
    } catch (error: any) {
      console.log("deletePlaylistSong store error: ", error)
      set({
        playlist: prevPlaylist,
        error: error.message,
      });
    } finally {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          playlistDelete: { deleting: false, deletingSongId: null },
        },
      }));
    }
  },

  askToChatbot: async (prompt) => {
    const tempId = crypto.randomUUID();

    set((state) => ({
      isLoading: {
        ...state.isLoading,
        chatbot: {
          ...state.isLoading.chatbot,
          sending: true,
        },
      },
      messages: [
        ...state.messages,
        { _id: tempId, role: "user", content: prompt },
      ],
    }));

    try {
      const res = await reqChatBot(prompt);

      set((state) => ({
        messages: [
          ...state.messages,
          { _id: res.botMsg._id, role: "model", content: res.botMsg.content },
        ],
      }));
    } catch (error: any) {
      console.log("askToChatbot store error", error);
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          chatbot: {
            ...state.isLoading.chatbot,
            sending: false,
          },
        },
      }));
    }
  },

  loadChatHistory: async () => {
    set((state) => ({
      isLoading: {
        ...state.isLoading,
        chatbot: {
          ...state.isLoading.chatbot,
          fetching: true,
        },
      },
    }));
    try {
      const history = await getChatHistory();
      set({ messages: history });
    } catch (error: any) {
      console.log("askToChatbot store error", error);
      set({ error: error.response.data.message });
    } finally {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          chatbot: {
            ...state.isLoading.chatbot,
            fetching: false,
          },
        },
      }));
    }
  },
}));
