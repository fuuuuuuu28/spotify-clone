"use client";

import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
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
import Chatbot from "./Chatbot";
import { useDebounce } from "./utils/useDebounce";
import { usePlayerStore } from "@/stores/usePlayerStore";
import useSearchSong from "@/hooks/useSearchSong";
import SearchInput from "./SearchInput";

type Session = typeof auth.$Infer.Session;

function Navbar({ session }: { session: Session | null }) {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const debounceKeyword = useDebounce(keyword, 300);
  
  const { data, isLoading } = useSearchSong(debounceKeyword);
  const { setCurrentSong } = usePlayerStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  // const handleTest = async () => {
  //   const test = await reqChatBot("Hello");
  //   console.log("first", test);
  // };

  return (
    <>
      <nav className="fixed top-0 left-0 bg-black w-full h-16 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2 ">
          {/* <button onClick={() =>handleTest()} className="bg-red-500">Click test</button> */}
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

          {/* Search function */}
          <SearchInput keyword={keyword} setKeyword={setKeyword} open={open} setOpen={setOpen} data={data} isLoading={isLoading} setCurrentSong={setCurrentSong}/>
        </div>

        <div className="flex items-center justify-between">
          <div className="hidden md:block border-r-2 border-primary-text gap-2 pr-6 space-x-5">
            <span
              onClick={() => {
                setIsOpen(!isOpen);
                setIsActive(!isActive);
              }}
              className={`p-2 rounded-xl font-bold text-md cursor-pointer hover:bg-secondary-text duration-100 ${isActive ? "bg-secondary-text" : "bg-white" }`}
            >
              Hỗ trợ AI
            </span>
            <span className="text-secondary-text font-bold text-md ">
              Premium
            </span>
            <span className="text-secondary-text font-bold text-md ">
              Support
            </span>
            <span className="text-secondary-text font-bold text-md">
              Download
            </span>
          </div>
          <div className="pl-6 space-x-5 ">
            {session ? (
              <div className="flex items-center gap-3 ">
                {/* modal giúp không block mất body scroll */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger>
                    <Image
                      src={session.user.image ?? "/images/avatar.png"}
                      alt={session.user.name ?? "User"}
                      width={30}
                      height={30}
                      className="rounded-full transition-all hover:scale-115 duration-300 hover:cursor-pointer"
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
      <Chatbot isOpen={isOpen} />
    </>
  );
}

export default Navbar;
