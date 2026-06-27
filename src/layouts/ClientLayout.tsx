
import { auth } from "@/lib/auth";
import React from "react";
<<<<<<< HEAD
import { fetchPlaylist } from "@/lib/actions/playlists-actions";
import MusicPlayer from "@/app/songs/MusicPlayer";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { fetchSongs } from "@/lib/api/song-api";
=======
import MusicPlayer from "@/app/songs/MusicPlayer";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
>>>>>>> 4c8d154 (comeback)
import { SongAPI } from "@/types/type";


type Session = typeof auth.$Infer.Session;
export async function ClientLayout({
  children,
  session,
<<<<<<< HEAD
  initialSongs,
=======
>>>>>>> 4c8d154 (comeback)
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
