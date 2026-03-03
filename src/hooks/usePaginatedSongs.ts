import { fetchSongs } from "@/lib/api/song-api";
import { SongAPI } from "@/types/type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function usePaginatedSongs(page: number) {
  return useQuery({
    queryKey: ["songs", page],
    queryFn: () => fetchSongs(page),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
}