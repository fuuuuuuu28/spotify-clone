import { fetchSongByArtist } from "@/lib/api/song-api";
import { useQuery } from "@tanstack/react-query";

export function useArtistSongs(artist:string,open:boolean){
    return useQuery({
        queryKey:["artist-songs", artist],
        queryFn:() => fetchSongByArtist(artist),
        enabled:!!artist &&open,
        staleTime:1000*60*5,
    })
}