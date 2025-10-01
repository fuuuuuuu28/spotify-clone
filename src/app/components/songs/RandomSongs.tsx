"use client";
import { usePlayerStore } from "@/stores/usePlayerStore";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaPlay } from "react-icons/fa";

function RandomSongs() {
  const { randomSongs, fetchRandomSong, setCurrentSong } = usePlayerStore();

  useEffect(() => {
    fetchRandomSong();
  }, [fetchRandomSong]);
  return (
    <>
      <h2 className="px-8 py-2 text-primary-text text-3xl font-bold">
        Random songs
      </h2>
      <div className="flex overflow-x-auto gap-2 px-4 py-2 scroll">
        {randomSongs.map((song) => (
          <div
            key={song._id}
            onClick={() => setCurrentSong(song)}
            className="flex-shrink-0 p-3 rounded-lg relative cursor-pointer hover:bg-hover group"
          >
            <div className="relative aspect-square">
              <Image
                alt="music"
                src={song.imageUrl}
                className="w-40 h-40 rounded-lg"
                width={500}
                height={500}
              />
              <button className="bottom-1 right-1 opacity-0 absolute bg-primary-button text-black text-lg p-3 rounded-full group-hover:bottom-3 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:scale-110 cursor-pointer">
                <FaPlay />
              </button>
            </div>
            <span className="block w-full text-secondary-text font-semibold truncate pr-1">
              {song.title}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default RandomSongs;
