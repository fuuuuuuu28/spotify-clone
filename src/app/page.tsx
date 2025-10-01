import { ClientLayout } from "@/layouts/ClientLayout";
import AllSongs from "./components/songs/AllSongs";
import Playlist from "./playlist/page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <ClientLayout session={session}>
      <div className="min-h-screen">
        <AllSongs session={session} />
        <Playlist />
      </div>
    </ClientLayout>
  );
}
