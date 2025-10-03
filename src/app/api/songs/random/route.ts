import {Song} from "@/models/Song";
import { NextResponse } from "next/server";
import React from "react";

export async function GET(req: Request) {
  try {
    // await ensureConnection;
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 10;

    const songs = await Song.aggregate([
      {
        $sample: { size: limit },
      },
    ]);
    return NextResponse.json({message:"Get random server: ",songs})
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Get random songs error"},{status:500})
  }
}
