
import { ClientLayout } from "@/layouts/ClientLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AllSongs from "./songs/AllSongs";
import { fetchSongs } from "@/lib/api/song-api";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [initialSongs] = await fetchSongs(1) ;
  return (
    <ClientLayout session={session} initialSongs={initialSongs}>
      <div className="min-h-screen">
        <AllSongs session={session} initialSongs={initialSongs} />
      </div>
    </ClientLayout>
  );
}
