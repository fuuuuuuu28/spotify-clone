
import { create } from "zustand";

interface MusicStore {
  isLoading: {
    songs: boolean;
  };
  error: string | null;

  hydrateFromStorage: () => void;
}

export const useMusicStore = create<MusicStore>(() => ({
  isLoading: {
    songs: false,
  },
  error: null,

    hydrateFromStorage: () => {

  },
}));
