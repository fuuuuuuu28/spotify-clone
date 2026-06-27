"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { TfiMenuAlt } from "react-icons/tfi";
import AddPlaylistDialog from "./AddPlaylistDialog";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { LuLoaderCircle } from "react-icons/lu";
import { SongAPI } from "@/types/type";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { usePlaylist, useRemoveFromPlaylist } from "@/hooks/useHandlePlaylist";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";

type Session = typeof auth.$Infer.Session;
function Sidebar({
  session,
}: {
  session: Session | null;
}) {
  const { data: playlist, isLoading } = usePlaylist();
  const { mutate: removeSong, isPending, variables } = useRemoveFromPlaylist();
  const { currentSongAPI, setCurrentSong } = usePlayerStore();

  const [isOpen, setIsOpen] = useState(false);

  const isDeleting = (songId: string) => isPending && variables === songId;
  const handleDelete = (songId: string) => {
    removeSong(songId, {
      onSuccess: () => {
        // server action trả string
        toast.success("Đã xóa bài hát",{position:"top-left"})
      },

      onError: (error) => {
        console.log("asdad",error)
        toast.error("Xóa bài hát thất bại",{position:"top-left"});
      },
    });
  };

  const arraySkeleton = Array.from({ length: 5 });

  return (
    <>
      <aside
        className={`fixed left-2 top-16 w-75 h-[calc(100vh-88px)] ${currentSongAPI ? "pb-4" : "pb-24"} overflow-hidden bg-background-theme ml-2 rounded-lg transform transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? "translate-x-0" : "translate-x-[-75%]"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between md:px-4 md:py-2 px-6 py-3 border-b">
          <VscLibrary className="size-8 text-primary-text" />
          <span className="text-primary-text text-md font-semibold">
            Your playlists
          </span>
          <div className="flex flex-col items-center  space-y-3 ">
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? (
                <GoSidebarExpand className="size-8 text-primary-text" />
              ) : (
                <GoSidebarCollapse className="size-8 text-primary-text" />
              )}
            </button>
            {session && <AddPlaylistDialog/>}
          </div>
        </div>

        <h2 className="text-primary-text px-4 py-2">Playlists</h2>
        <div className="hidden md:flex items-center justify-between px-4 py-2">
          <div className=""></div>
          <div className="flex items-center gap-2 ">
            <h2 className="text-secondary-text">Recents</h2>
            <TfiMenuAlt className="size-8 text-secondary-text" />
          </div>
        </div>

        {/* Playlists */}
        {session ? (
          <div className="h-[calc(100vh-320px)] overflow-y-auto scroll">
            {isLoading ? (
              <>
                {arraySkeleton.map((_, index) => (
                  <div
                    key={index}
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
              <div className="w-full">
                {!playlist?.songs || playlist?.songs.length == 0 ? (
                  <div className="text-center ">
                    <span className="text-primary-text text-md font-semibold">
                      Không có bài hát
                    </span>
                  </div>
                ) : (
                  <>
                    {playlist?.songs?.map((song) => (
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
                        <Button
                          onClick={() => handleDelete(song._id)}
                          className="hover:bg-hover rounded-full p-4 duration-300 cursor-pointer"
                        >
                          {isDeleting(song._id) ? (
                            <LuLoaderCircle className="animate-spin text-primary-text" />
                          ) : (
                            <FaTrash className="text-primary-text " />
                          )}
                        </Button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
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
      </aside>
    </>
  );
}

export default Sidebar;
