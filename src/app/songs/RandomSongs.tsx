"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRandomSong } from "@/hooks/useRandomSong";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { SongAPI } from "@/types/type";
import { LucideRefreshCcw } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaPlay } from "react-icons/fa";

function RandomSongs({ randomSongs = [] }: { randomSongs: SongAPI[] }) {
  const { data, isLoading, isFetching, refetch } = useRandomSong();

  const { setCurrentSong } = usePlayerStore();

  const arraySkeleton = Array.from({ length: 5 });

  return (
    <>
      <h2 className="px-8 py-2 text-primary-text text-3xl font-bold">
        Random songs
      </h2>
      <div className="flex items-center overflow-x-auto gap-2 p-4 scroll">
        {isLoading ? (
          <>
            {arraySkeleton.map((_, index) => (
              <div className="flex-shrink-0 p-3 rounded-lg relative cursor-pointer hover:bg-hover group">
                <div className="relative w-full aspect-square">
                  <Skeleton className="w-40 h-40" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {data?.map((song: SongAPI) => (
              <div
                key={song._id}
                onClick={() => setCurrentSong(song)}
                className="flex-shrink-0 w-[185px] p-3 rounded-lg relative cursor-pointer hover:bg-hover group"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    alt="music"
                    src={song.image_music}
                    className="w-40 h-40 rounded-lg"
                    width={500}
                    height={500}
                  />
                  <button className="bottom-1 right-1 opacity-0 absolute bg-primary-button text-black text-lg p-3 rounded-full group-hover:bottom-3 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:scale-110 cursor-pointer">
                    <FaPlay />
                  </button>
                </div>
                <span className="block w-full text-primary-text font-semibold truncate pr-1">
                  {song.name_music}
                </span>
                <span className="block w-full text-secondary-text text-xs font-semibold truncate pr-1 hover:underline">
                  {song.name_singer}
                </span>
              </div>
            ))}
          </>
        )}
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 rounded hover:bg-hover hover:cursor-pointer"
        >
          <LucideRefreshCcw className={`${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </>
  );
}

export default RandomSongs;
