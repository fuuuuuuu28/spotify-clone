import {
  addToPlaylist,
  fetchPlaylist,
  removeFromPlaylist,
} from "@/lib/actions/playlists-actions";
import { Playlist, SongAPI } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function usePlaylist() {
  return useQuery({
    queryKey: ["playlist"],
    queryFn: fetchPlaylist,
  });
}

export function useAddToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-song"],

    mutationFn: async (song: SongAPI) => {
      return addToPlaylist(song);
    },

    // optimistic update
    onMutate: async (song) => {
      await queryClient.cancelQueries({ queryKey: ["playlist"] });

      const prev = queryClient.getQueryData<any>(["playlist"]);

      queryClient.setQueryData(["playlist"], (old: any) => {
        if (!old) return old;

        // tránh add trùng
        const exists = old.songs.some((s: SongAPI) => s._id === song._id);
        if (exists) return old;

        return {
          ...old,
          songs: [...old.songs, song],
        };
      });

      return { prev };
    },

    onError: (err, song, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["playlist"], ctx.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
  });
}

export function useRemoveFromPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["remove-songs"],

    mutationFn: async (songId: string) => {
      return removeFromPlaylist(songId);
    },

    onMutate: async (songId) => {
      await queryClient.cancelQueries({ queryKey: ["playlist"] });

      const prev = queryClient.getQueryData<any>(["playlist"]);

      queryClient.setQueryData(["playlist"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          songs: old.songs.filter((s: SongAPI) => s._id !== songId),
        };
      });

      return { prev };
    },

    onError: (_err, _songId, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["playlist"], ctx.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist"] });
    },
  });
}
