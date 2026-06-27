
import { auth } from "@/lib/auth";
import React from "react";
import MusicPlayer from "@/app/songs/MusicPlayer";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { SongAPI } from "@/types/type";


type Session = typeof auth.$Infer.Session;
export async function ClientLayout({
  children,
  session,
}: Readonly<{ children: React.ReactNode; session: Session | null, initialSongs: SongAPI[]}>) {

  return (
    <div className="min-h-screen">
      <Navbar session={session} />
      <main className="">
        <Sidebar session={session}/>
        {children}
      </main>
      <MusicPlayer />
    </div>
  );
}
