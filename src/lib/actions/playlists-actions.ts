"use server";

import { connectionToDatabase } from "../mongoose";
import { auth } from "../auth";
import { headers } from "next/headers";
import { Playlist, Song } from "@/models/model";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

//SSR phải sử dụng types do sử dụng Array of object chứ không phải Single object
type PlaylistType = {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  songs: any[];
};

type SongType = {
  _id: string;
  name_music: string;
  name_singer: string;
  image_music: string;
  src_music: string;
};

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  return { userId: session?.user.id };
}

export async function fetchPlaylist() {
  const  {userId}  = await requireUser();
  // console.log("first", userId)

  await connectionToDatabase();

  const playlist = (await Playlist.findOne({ user_id: userId })
    .populate("songs")
    .lean()) as PlaylistType | null;

  // if (!playlist) {
  //   throw new Error("Not found playlist");
  // }

  // console.log(playlist)
  return {
    ...playlist,
    _id: playlist?._id.toString(),
    user_id: playlist?.user_id.toString(),
    songs: playlist?.songs.map((song: any) => ({
      ...song,
      _id: song._id.toString(),
    })),
  };
}

export async function addToPlaylist(song: SongType) {
  const { userId } = await requireUser();
  if (!userId) {
    throw new Error("Unauthorization");
  }

  await connectionToDatabase();
  const externalId = song._id;

  let existingSong = await Song.findOne({ externalId });
  // console.log(existingSong)
  if (!existingSong) {
    existingSong = await Song.create({
      externalId: song._id,
      name_music: song.name_music,
      name_singer: song.name_singer,
      image_music: song.image_music,
      src_music: song.src_music,
    });
  }

  const alreadyHave = await Playlist.findOne({
    user_id: userId,
    songs: existingSong._id,
  });
  if (alreadyHave) {
    return "Already have this song";
  }

  await Playlist.findOneAndUpdate(
    { user_id: userId },
    { $addToSet: { songs: existingSong._id } },
    { upsert: true },
  );

  // ⭐ BẮT BUỘC
  return {
      ok: true,
      song: {
        _id: existingSong._id.toString(),
        externalId: existingSong.externalId,
        name_music: existingSong.name_music,
        name_singer: existingSong.name_singer,
        image_music: existingSong.image_music,
        src_music: existingSong.src_music,
        createdAt: existingSong.createdAt.toISOString(),
        updatedAt: existingSong.updatedAt.toISOString(),
      },
    };
}

export async function removeFromPlaylist(songId: string) {
  const { userId } = await requireUser();
  if (!userId) {
    throw new Error("Unauthorization");
  }

  await connectionToDatabase();
  // console.log("songId", songId);
  const res = await Playlist.findOneAndUpdate(
    { user_id:userId },
    { $pull: { songs: songId } },
    { new: true },
  );

  // console.log("first", res);
  return { success: true };
}
