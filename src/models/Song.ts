import mongoose, { Schema } from "mongoose";

const songSchema = new mongoose.Schema(
  {
    name_music: { type: String, required: true },
    name_singer: { type: String, required: true },
    image_music: { type: String, required: true },
    src_music: { type: String, required: true },
    user_id: { type: String, required: true },

  },
  { timestamps: true }
);

export const Song =
  mongoose.models.songs || mongoose.model("songs", songSchema);

const playlistSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    songs: [{type: Schema.Types.ObjectId, ref:"songs"}],
  },
  {
    timestamps: true,
  }
);
export const Playlist =
  mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);
