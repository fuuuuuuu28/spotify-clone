import { connectionToDatabase } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { Song } from "@/models/Song";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// let isConnected = false;
// async function ensureConnection() {
//   if (isConnected) {
//     await connectionToDatabase();
//     isConnected = true;
//   }
// }
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

    // const uploadDir = path.join(process.cwd(), "public/uploads");
    // if (!fs.existsSync(uploadDir)) {
    //   fs.mkdirSync(uploadDir, { recursive: true });
    // }

    // image.arrayBuffer(): Chuyển file hình ảnh thành ArrayBuffer
    // Buffer.from(): Chuyển ArrayBuffer thành Buffer có thể ghi file
    // Date.now() + "-" + image.name: Tạo tên file duy nhất
    // path.join(uploadDir, imageName): Tạo đường dẫn file
    // fs.writeFileSync(): Ghi file đồng bộ đĩa cứng
    // const imageBytes = Buffer.from(await image.arrayBuffer());
    // const imageName = Date.now() + "-" + image.name;
    // const imagePath = path.join(uploadDir, imageName);
    // fs.writeFileSync(imagePath, imageBytes);

    // const audioBytes = Buffer.from(await audio.arrayBuffer());
    // const audioName = Date.now() + "-" + audio.name;
    // const audioPath = path.join(uploadDir, audioName);
    // fs.writeFileSync(audioPath, audioBytes);

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
      title,
      artist,
      user_id: userId,
      imageUrl: uploadedImage.secure_url,
      audioUrl: uploadedAudio.secure_url,
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