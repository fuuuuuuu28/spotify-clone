import { auth } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/mongoose";
import { Playlist } from "@/models/Song";
import { NextResponse } from "next/server";

// let isConnected = false;
// async function ensureConnection() {
//   if (isConnected) {
//     await connectionToDatabase();
//     isConnected = true;
//   }
// }

export async function POST(req: Request) {
  try {
    // await ensureConnection();
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { songId } = await req.json();
    const playlistPOST = await Playlist.findOneAndUpdate(
      { user_id: userId },
      { $addToSet: { songs: songId } },
      { new: true, upsert: true }
    ).populate("songs");

    return NextResponse.json(
      { playlist: playlistPOST, message: "Playlist POST server: " },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Playlist POST server error: ", error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // await ensureConnection();
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const playlistGET = await Playlist.findOne({ user_id: userId }).populate(
      "songs"
    );
    // console.log("playlist server: ", playlist)
    return NextResponse.json(
      { playlist: playlistGET, message: "Playlist GET server: " },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Playlist GET server error: ", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // await ensureConnection();
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { songId } = await req.json();
    const playlistDELE = await Playlist.findOneAndUpdate(
      { user_id: userId },
      { $pull: { songs: songId } },
      { new: true }
    ).populate("songs");
    return NextResponse.json(
      { playlist: playlistDELE, message: "Playlist DELE server: " },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Playlist DELE server error: ", error },
      { status: 500 }
    );
  }
}
