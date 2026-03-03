
import { ClientLayout } from "@/layouts/ClientLayout";
import Playlist from "./playlist/page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AllSongs from "./songs/AllSongs";
import { fetchRandomSong, fetchSongs } from "@/lib/api/song-api";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [initialSongs, randomSongs] = await Promise.all([
    fetchSongs(1),
    fetchRandomSong(),
  ]);
  return (
    <ClientLayout session={session} initialSongs={initialSongs}>
      <div className="min-h-screen">
        <AllSongs session={session} initialSongs={initialSongs} randomSongs={randomSongs} />
      </div>
    </ClientLayout>
  );
}
