import { auth } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/mongoose";
import { Playlist, Song } from "@/models/Song";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectionToDatabase();
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { song } = await req.json();
    const externalId = song._id;

    let existingSong = await Song.findOne({ externalId });
    // console.log("first")
    if (!existingSong) {
      existingSong = await Song.create({
        externalId,
        name_music: song.name_music,
        name_singer: song.name_singer,
        image_music: song.image_music,
        src_music: song.src_music,
      });
    }

    const playlist = await Playlist.findOne({ user_id: userId });
    //equals dùng để so sánh giá trị bên trong Object
    if (playlist && playlist.songs.some((id:any) => id.equals(existingSong._id))) {
      return NextResponse.json(
        { message: "Already have this song" },
        { status: 200 }
      );
    }
    const playlistPOST = await Playlist.findOneAndUpdate(
      { user_id: userId },
      { $addToSet: { songs: existingSong._id } },
      { new: true, upsert: true }
    ).populate("songs");
    // console.log("ads", playlistPOST?.songs);

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
    await connectionToDatabase();
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    let playlistGET = await Playlist.findOne({ user_id: userId }).populate(
      "songs"
    );

    // console.log("playlist server: ", playlistGET)
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
    await connectionToDatabase();
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
