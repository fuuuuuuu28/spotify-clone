"use client";

import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { MdHome } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/actions/auth-actions";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Skeleton } from "@/components/ui/skeleton";

type Session = typeof auth.$Infer.Session;
function Navbar({ session }: { session: Session | null }) {
  const [keyword, setKeyWord] = useState("");
  const [focus, setFocus] = useState(false);
  const { fetchSearch, searchResults, fetchSongs, songsAPI, isLoading, setCurrentSong } =
    usePlayerStore();

  const arraySkeleton = Array.from({ length: 5 });

  const handleLogout = async () => {
    await signOut();
  };

  const handleSearch = async () => {
    if (keyword.trim() !== "") {
      fetchSearch(keyword, 1);
    }
  };

  const handlePress = async (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (keyword.trim() === "") {
      fetchSongs(1);
      return;
    }

    fetchSearch(keyword, 1);
  }, [keyword]);

  return (
    <nav className="fixed top-0 left-0 bg-black w-full h-16 flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-2 ">
        <Image
          src="/images/logo.png"
          alt="logo"
          className="size-10"
          width={500}
          height={500}
        />
        <Link
          href="/"
          className="bg-background-theme rounded-full ml-4 p-2 hover:bg-hover hover:scale-105 duration-300"
        >
          <MdHome className="size-8 text-white">
            <Link href="/" />
          </MdHome>
        </Link>
        <div className="bg-background-theme hidden lg:flex items-center h-11 w-90 px-2 gap-3 text-primary-text rounded-full hover:bg-hover duration-300">
          <GoSearch className="text-primary-text shrink-0" size={25} />
          <input
            className="h-full w-full outline-none placeholder:text-white"
            type="text"
            placeholder="What do you want to play?"
            onChange={(e) => setKeyWord(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyPress={handlePress}
          />
        </div>

        {/* Render kết quả */}
        <div onMouseDown={(e) => e.preventDefault()} className="absolute top-16 left-16 w-[500px] bg-black max-h-50 overflow-y-auto scroll rounded-b-xl">
          {/* Input rỗng → hiện bài hát đề xuất */}
          {keyword.trim() === "" &&
            focus &&
            songsAPI.map((song) => (
              <div
                key={song._id}
                onClick={() => setCurrentSong(song)}
                className="flex items-center gap-4 bg-background-theme m-4 p-4 text-white rounded-lg my-2 hover:bg-hover hover:cursor-pointer"
              >
                <Image
                  src={song.image_music}
                  alt="music"
                  className="size-10"
                  width={500}
                  height={500}
                />
                <span>
                  {song.name_music} – {song.name_singer}
                </span>
              </div>
            ))}

          {/* Có keyword → hiện search */}
          {keyword.trim() !== "" &&
            (isLoading.search ? (
              <div>
                {arraySkeleton.map((_, index) => (
                  <div className="flex items-center gap-4 bg-background-theme m-4 p-4 text-white rounded-lg my-2">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="w-60 h-5" />
                  </div>
                ))}
              </div>
            ) : (
              searchResults.map((song) => (
                <div
                  key={song._id}
                  onClick={() => setCurrentSong(song)}
                  className="flex items-center gap-4 bg-background-theme m-4 p-4 text-white rounded-lg my-2 hover:bg-hover hover:cursor-pointer"
                >
                  <Image
                    src={song.image_music}
                    alt="music"
                    className="size-10"
                    width={500}
                    height={500}
                  />
                  <span>
                    {song.name_music} – {song.name_singer}
                  </span>
                </div>
              ))
            ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="hidden md:block border-r-2 border-primary-text gap-2 pr-6 space-x-5">
          <span className="text-secondary-text font-bold text-md ">
            Premium
          </span>
          <span className="text-secondary-text font-bold text-md ">
            Support
          </span>
          <span className="text-secondary-text font-bold text-md ">
            Download
          </span>
        </div>
        <div className="pl-6 space-x-5">
          {session ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Image
                    src={session.user.image ?? "/images/avatar.png"}
                    alt={session.user.name ?? "User"}
                    width={30}
                    height={30}
                    className="rounded-full transition-all hover:scale-115 duration-300"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="hover:bg-hover cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link
                href="/signup"
                className="text-secondary-text font-bold text-md hover:text-primary-text hover:text-lg duration-300"
              >
                Sign up
              </Link>

              <Link
                href="/login"
                className="font-semibold text-md bg-white py-3 px-6 rounded-full hover:scale-105 transition-all duration-300"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
