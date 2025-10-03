"use client";
import { auth } from "@/lib/auth";
import { usePlayerStore } from "@/stores/usePlayerStore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import RandomSongs from "./RandomSongs";

type Session = typeof auth.$Infer.Session;
function AllSongs({ session }: { session: Session | null }) {
  const {
    fetchSongs,
    songs,
    currentSong,
    setCurrentSong,
    isPlaying,
  } = usePlayerStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSongs();
    // console.log("session: ",session)
  }, [fetchSongs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-primary-text">
        Loading songs...
      </div>
    );
  }
  return (
    <div className="min-h-[90vh] my-16 bg-background-theme ml-24 mr-2 md:ml-80 rounded-lg overflow-y-auto overflow-x-hidden">
      <div className="min-h-[50vh] bg-gradient-to-b from-emerald-500 to-background-theme px-8 py-4">
        <div className="flex flex-col transition-all duration-200 ease-in-out">
          {!currentSong && (
            <h1 className="flex gap-2 text-3xl md:text-4xl font-bold text-primary-text">
              Welcome{" "}
              <span className="text-username-text">
                {!session ? "Guest" : session.user.name}
              </span>
            </h1>
          )}
          <div
            className={`transition-all duration-200 ease-in-out ${
              currentSong ? "mt-0" : "mt-4"
            }`}
          >
            <span className="text-lg md:text-2xl font-semibold text-primary-text">
              Enjoy music & chill
            </span>
            <p className="text-xs md:text-sm text-secondary-text">
              and thank you for visited
            </p>
          </div>
        </div>
        {currentSong && (
          <>
            <div className="flex flex-col md:flex-row items-center px-8 py-4">
              <Image
                alt="music"
                src={currentSong.imageUrl}
                className={`size-50 rounded-full spin-slow ${
                  isPlaying ? "" : "paused"
                }`}
                width={500}
                height={500}
              />
              <div className="px-4 py-4 space-y-2">
                <h1 className="text-primary-text font-semibold text-3xl ">
                  {currentSong.title}{" "}
                </h1>
                <p className="text-secondary-text ">{currentSong.artist} </p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex px-8 py-2">
        <Link
          href="/upload-song"
          className="flex items-center bg-primary-text text-background-theme font-semibold text-xs rounded-full px-4 py-2 gap-2 hover:bg-secondary-text duration-300 hover:scale-105"
        >
          <h2 className="text-background-theme">Add your song</h2>
          <LuPlus className="text-background-theme" />
        </Link>
      </div>

      {/* Music */}
      <h2 className="px-8 py-2 text-primary-text text-3xl font-bold">
        Music for you
      </h2>
      <div className="flex overflow-x-auto gap-2 px-4 py-2 scroll">
        {songs.map((song) => (
          <div
            key={song._id}
            onClick={() => setCurrentSong(song)}
            className="flex-shrink-0 p-3 rounded-lg relative cursor-pointer hover:bg-hover group"
          >
            <div className="relative w-full aspect-square">
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

      {/*Random Music */}
      <RandomSongs/>
    </div>
  );
}

export default AllSongs;
