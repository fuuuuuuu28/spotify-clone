"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function Upload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!title || !artist || !image || !audio) {
      setMessage("All fields is require");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("imageFile", image);
    formData.append("audioFile", audio);

    try {
      const res = await axios.post("/api/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(res.data);
      setMessage(res.data.message || "Upload thành công");
      setTitle("");
      setArtist("");
      setImage(null);
      setAudio(null);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="bg-hover w-full h-screen flex items-center justify-center">
      <div className="bg-background-theme max-w-[480px] w-[90%] flex flex-col items-center px-6 lg:px-12 py-6 rounded-md ">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={500}
          height={500}
          className="h-11 w-11"
        />
        <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">
          Upload to Spotify
        </h2>
        {message ? (
          <div className="bg-primary-button font-semibold p-2 mb-4">
            <p>{message}</p>
          </div>
        ) : (
          <></>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <input
            type="text"
            placeholder="Artist"
            onChange={(e) => setArtist(e.target.value)}
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <label htmlFor="audio" className="block py-2 text-secondary-text">
            Audio
          </label>
          <input
            accept="audio/*"
            id="audio"
            type="file"
            onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <label htmlFor="cover" className="block py-2 text-secondary-text">
            Cover Image
          </label>
          <input
            accept="image/*"
            id="cover"
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />

          {loading ? (
            <button className="bg-primary-button py-3 rounded-full w-full font-bold hover:scale-105 hover:bg-secondary-button cursor-pointer transition-all duration-300">
              Uploading
            </button>
          ) : (
            <button className="bg-primary-button py-3 rounded-full w-full font-bold hover:scale-105 hover:bg-secondary-button cursor-pointer transition-all duration-300">
              Add Song
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Upload;
