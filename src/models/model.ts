import mongoose, { Schema } from "mongoose";

const songSchema = new mongoose.Schema(
  {
    externalId: { type: String, unique: true },
    name_music: { type: String, required: true },
    name_singer: { type: String, required: true },
    image_music: { type: String, required: true },
    src_music: { type: String, required: true },
  },
  { timestamps: true },
);
export const Song = mongoose.models.songs || mongoose.model("songs", songSchema);

const playlistSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    songs: [{ type: Schema.Types.ObjectId, ref: "songs" }],
  },
  {
    timestamps: true,
  },
);
export const Playlist = mongoose.models.playlists || mongoose.model("playlists", playlistSchema);

const messageSchema = new mongoose.Schema({
  user_id: { type: String, required:true},
  role: { type: String, enum: ["model", "user"], required: true },
  content: { type: String, required: true },
});
export const Message = mongoose.models.messages || mongoose.model("messages", messageSchema);
