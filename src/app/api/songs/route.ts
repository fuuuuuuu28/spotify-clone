import { connectionToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { Song } from "@/models/Song";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await connectionToDatabase();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;

    const image = formData.get("imageFile") as any;
    const audio = formData.get("audioFile") as any;

    if (!title || !artist || !userId || !image || !audio) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const imageBytes = Buffer.from(await image.arrayBuffer());
    const imageBase64 = `data:${image.type};base64,${imageBytes.toString(
      "base64"
    )}`;
    const uploadedImage = await cloudinary.uploader.upload(imageBase64, {
      folder: "songs/images",
      resource_type: "image",
    });

    // Xử lý audio
    const audioBytes = Buffer.from(await audio.arrayBuffer());
    const audioBase64 = `data:${audio.type};base64,${audioBytes.toString(
      "base64"
    )}`;
    const uploadedAudio = await cloudinary.uploader.upload(audioBase64, {
      folder: "songs/audio",
      resource_type: "video", // bắt buộc cho audio
    });
    const newSong = await Song.create({
      name_music: title,
      name_singer: artist,
      image_music: uploadedImage.secure_url,
      src_music: uploadedAudio.secure_url,
      externalId: null, // do bài user upload không phải từ API khác
    });

    return NextResponse.json({ message: "Upload thành công", song: newSong });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Post songs error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectionToDatabase();

    const songs = await Song.find({});
    return NextResponse.json({ message: "Get songs", songs });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Get songs server error" },
      { status: 500 }
    );
  }
}