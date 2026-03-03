"use client"
import { usePlayerStore } from '@/stores/usePlayerStore'
import React, { useEffect } from 'react'

function TitleClient() {
    const currentSong = usePlayerStore((state) => state.currentSongAPI);
    useEffect(() =>{
        if(currentSong?.name_music){
            document.title = `${currentSong.name_music} | Spotify-clone`;
        }else{
            document.title = "Spotify-clone"
        }
    }, [currentSong]);
  return (
    null
  )
}

export default TitleClient