import { fetchRandomSong } from "@/lib/api/song-api";
import { useQuery } from "@tanstack/react-query";

export function useRandomSong(){
    return useQuery({
        queryKey:["random-songs"],
        queryFn:fetchRandomSong,
        staleTime:0,
        refetchOnWindowFocus:false,
    })
}