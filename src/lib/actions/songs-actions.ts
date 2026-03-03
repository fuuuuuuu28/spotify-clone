"use server"

import { Song } from "@/models/model";
import { connectionToDatabase } from "../mongoose";
import cloudinary from "../cloudinary";
import { auth } from "../auth";
import { headers } from "next/headers";

export async function uploadSong(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id
    if (!userId) {
      throw new Error("Unauthorization");
    }

    await connectionToDatabase();

    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;

    const image = formData.get("imageFile") as any;
    const audio = formData.get("audioFile") as any;

    if (!title || !artist || !userId || !image || !audio) {
      throw new Error("Missing fields");
    }

    const imageBytes = Buffer.from(await image.arrayBuffer());
    const imageBase64 = `data:${image.type};base64,${imageBytes.toString(
      "base64",
    )}`;
    const uploadedImage = await cloudinary.uploader.upload(imageBase64, {
      folder: "songs/images",
      resource_type: "image",
    });

    // Xử lý audio
    const audioBytes = Buffer.from(await audio.arrayBuffer());
    const audioBase64 = `data:${audio.type};base64,${audioBytes.toString(
      "base64",
    )}`;
    const uploadedAudio = await cloudinary.uploader.upload(audioBase64, {
      folder: "songs/audio",
      resource_type: "video", // bắt buộc cho audio
    });

    const existed = await Song.findOne({
      name_music: title,
      name_singer: artist,
    });

    if (existed) {
      throw new Error("Bài hát đã tồn tại");
    }
    const newSong = await Song.create({
      name_music: title,
      name_singer: artist,
      image_music: uploadedImage.secure_url,
      src_music: uploadedAudio.secure_url,
      externalId: null, // do bài user upload không phải từ API khác
    });

    return {
      message: "Upload thành công",
      song: {
        _id: newSong._id.toString(),
        name_music: newSong.name_music,
        name_singer: newSong.name_singer,
        image_music: newSong.image_music,
        src_music: newSong.src_music,
      },
  };
}
