import { fetchSongs } from '@/lib/api/song-api'
import { SongAPI } from '@/types/type'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React from 'react'

export function useInfiniteSongs(initialSongs:SongAPI[]){
  return useInfiniteQuery({
    queryKey:["songs"],
    queryFn:async({ pageParam = 1}) =>{
      return fetchSongs(pageParam)
    },
    initialPageParam:1,
    getNextPageParam:(lastPage, allPages) =>{
      if(!lastPage || lastPage.length ===0) return undefined;
      return allPages.length + 1;
    },
    initialData:{
      pages:[initialSongs],
      pageParams:[1],
    }
  })
}