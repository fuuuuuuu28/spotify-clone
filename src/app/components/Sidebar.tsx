"use client";

import { usePlayerStore } from "@/stores/usePlayerStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoSearch, GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { TfiMenuAlt } from "react-icons/tfi";
import AddPlaylist from "./songs/AddPlaylist";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

type Session = typeof auth.$Infer.Session;
function Sidebar({ session }: { session: Session | null }) {
  const {
    fetchSongs,
    playlist,
    fetchPlaylist,
    setCurrentSong,
    deleteSong,
    isLoading,
  } = usePlayerStore();

  const [isOpen, setIsOpen] = useState(false);

  const arraySkeleton = Array.from({ length: 5 });

  useEffect(() => {
    fetchSongs;
    fetchPlaylist();
  }, [fetchSongs, fetchPlaylist]);

  return (
    <>
      <aside
        className={`fixed left-2 top-16 w-75 h-[90vh] bg-background-theme ml-2 rounded-lg transform transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-[75%]"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between md:px-4 md:py-2 px-6 py-3 border-b-1">
          <VscLibrary className="size-8 text-primary-text" />
          <span className="text-primary-text text-md font-semibold">
            Your library
          </span>
          <div className="flex flex-col items-center  space-y-3 ">
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? (
                <GoSidebarExpand className="size-8 text-primary-text" />
              ) : (
                <GoSidebarCollapse className="size-8 text-primary-text" />
              )}
            </button>
            {session && <AddPlaylist />}
          </div>
        </div>

        <h2 className="text-primary-text px-4 py-2">Playlists</h2>
        <div className="hidden md:flex items-center justify-between px-4 py-2">
          <GoSearch className="size-10 text-secondary-text hover:bg-hover hover:text-primary-text duration-300 rounded-full p-2" />
          <div className="flex items-center gap-2 transform transition-transform duration-300 hover:scale-105 group">
            <h2 className="text-secondary-text group-hover:text-primary-text">
              Recents
            </h2>
            <TfiMenuAlt className="size-8 text-secondary-text group-hover:text-primary-text" />
          </div>
        </div>

        {/* Playlists */}
        {session ? (
          <>
            {isLoading ? (
              <>
                {arraySkeleton.map((_, index) => (
                  <div
                    className={`flex ${
                      isOpen ? "flex-row" : "flex-row-reverse"
                    } md:flex-row md:items-center justify-between  `}
                  >
                    <div className="flex items-center rounded-lg md:w-full gap-2 px-4 py-2 hover:bg-hover duration-300 cursor-pointer">
                      <Skeleton className="size-16 rounded-lg" />
                      <div
                        className={`md:block ${
                          isOpen ? "" : "hidden"
                        } space-y-2`}
                      >
                        <Skeleton className="w-36 h-5" />
                        <Skeleton className="w-20 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {playlist?.songs.map((song) => (
                  <div
                    key={song._id}
                    className={`flex ${
                      isOpen ? "flex-row" : "flex-row-reverse"
                    } md:flex-row md:items-center justify-between  `}
                  >
                    <div
                      onClick={() => setCurrentSong(song)}
                      className="flex items-center rounded-lg md:w-full gap-2 px-4 py-2 hover:bg-hover duration-300 cursor-pointer"
                    >
                      <Image
                        alt="cover-5"
                        src={song.image_music}
                        width={500}
                        height={500}
                        className="size-16 rounded-lg"
                      />
                      <div
                        className={`md:block ${
                          isOpen ? "" : "hidden"
                        } space-y-2`}
                      >
                        <h2 className="text-primary-text text-lg font-semibold">
                          {song.name_music}{" "}
                        </h2>
                        <span className="text-secondary-text text-sm">
                          {song.name_singer}
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() => deleteSong(song._id)}
                      className="hover:bg-hover rounded-full p-4 duration-300 cursor-pointer"
                    >
                      <FaTrash className="text-primary-text " />
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <p className="text-primary-text text-lg font-bold">
              You should login
            </p>
            <Link
              href="/login"
              className="font-semibold text-md bg-white py-3 px-6 rounded-full hover:scale-105 transition-all duration-300"
            >
              Login
            </Link>
          </div>
        )}

        {/* <aside className="fixed top-16 left-2 w-30 h-[90vh] flex flex-col">
            <button onClick={() => setIsOpen(!isOpen)} className="">
              <GoSidebarCollapse className="size-6 text-primary-text" />{" "}
            </button>
            <div className="">
              {playlist?.songs.map((song) => (
                <Image
                  key={song._id}
                  alt="playlist"
                  src={song.image_music}
                  width={30}
                  height={30}
                />
              ))}
            </div>
          </aside> */}
      </aside>
    </>
  );
}

export default Sidebar;
