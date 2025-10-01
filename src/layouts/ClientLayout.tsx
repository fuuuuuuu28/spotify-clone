import MusicPlayer from "@/app/components/songs/MusicPlayer";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { auth } from "@/lib/auth";
import React from "react";

type Session = typeof auth.$Infer.Session;
export async function ClientLayout({
  children,
  session,
}: Readonly<{ children: React.ReactNode; session: Session | null }>) {
  return (
    <div className="min-h-screen">
      <Navbar session={session} />
      <main>
        <Sidebar session={session} />
        <MusicPlayer />
        {children}
      </main>
    </div>
  );
}
