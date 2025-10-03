import mongoose, { Schema } from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    imageUrl: { type: String, required: true },
    audioUrl: { type: String, required: true },
    user_id: { type: String, required: true },
  },
  { timestamps: true }
);

export const Song = mongoose.models.songs || mongoose.model("songs", songSchema);

const playlistSchema = new mongoose.Schema(
  {
    user_id:{ type:String, required:true},
    songs:[{type: Schema.Types.ObjectId, ref:"songs" }]
  },
  {
    timestamps:true
  }
)
export const Playlist = mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema)