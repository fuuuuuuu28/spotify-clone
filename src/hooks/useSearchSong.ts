import { fetchSearch } from '@/lib/api/song-api'
import { useQuery } from '@tanstack/react-query'


function useSearchSong(keyword:string) {
  return useQuery({
    queryKey:["search-songs",keyword],
    queryFn: ()=>fetchSearch(keyword),
    enabled:!!keyword,
    staleTime:1000*30,
  })
}

export default useSearchSong