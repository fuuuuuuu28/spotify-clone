import { Song } from "@/models/Song";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { _id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    const songs = await Song.find({ _id: params._id })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Song.countDocuments({ _id: params._id });

    return NextResponse.json(
      {
        songs,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        message: "Playlist pagination: ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Playlist pagination error server: ", error },
      { status: 500 }
    );
  }
}
