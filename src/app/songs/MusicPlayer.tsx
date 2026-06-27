"use client";

import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { CiShuffle } from "react-icons/ci";
import {
  FaPauseCircle,
  FaPlayCircle,
  FaStepBackward,
  FaStepForward,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { MdQueueMusic } from "react-icons/md";

function MusicPlayer() {
  const { songsAPI } = useMusicStore();
  const {
    volume,
    setVolume,
    isRepeat,
    setRepeat,
    isRandom,
    setRandom,
    setIsPlaying,
    isPlaying,
    setCurrentSong,
    currentSongAPI,
    hydrateFromStorage,
  } = usePlayerStore();

  const [process, setProcess] = useState(0);
  // const [volume, setVolume] = useState(75);
  // const [isRepeat, setIsRepeat] = useState(false);
  // const [isRandom, setIsRandom] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes} : ${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongAPI]);

  const handlePlay = () => {
    if (currentSongAPI) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleUpdateTime = () => {
    if (
      !audioRef.current ||
      !audioRef.current.duration ||
      isNaN(audioRef.current.duration)
    ) {
      return;
    }
    setProcess(
      (audioRef.current.currentTime / audioRef.current.duration) * 100,
    );
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const value = Number(e.target.value);
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
      setProcess(value);
    }
  };

  const handleNext = () => {
    const currentIndex = songsAPI.findIndex(
      (s) => s._id === currentSongAPI?._id,
    );
    const nextIndex = (currentIndex + 1) % songsAPI.length;
    // console.log("songs: ",songsAPI[0]
    console.log(
      "index",
      songsAPI.findIndex((s) => s._id === currentSongAPI?._id),
    );
    setCurrentSong(songsAPI[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = songsAPI.findIndex(
      (s) => s._id === currentSongAPI?._id,
    );
    const prevIndex = (currentIndex - 1 + songsAPI.length) % songsAPI.length;
    setCurrentSong(songsAPI[prevIndex]);
  };

  const handleRepeat = () => {
    setRepeat(!isRepeat);
  };

  const handleShuffle = () => {
    setRandom(!isRandom);
  };

  const handleRandom = () => {
    const currentIndex = songsAPI.findIndex(
      (s) => s._id === currentSongAPI?._id,
    );
    let randomIndex;
<<<<<<< HEAD
=======
    if (songsAPI.length <= 1) {
      return; // Không có bài hát khác để phát ngẫu nhiên
    }
>>>>>>> 4c8d154 (comeback)
    do {
      randomIndex = Math.floor(Math.random() * songsAPI.length);
    } while (randomIndex === currentIndex);
    setCurrentSong(songsAPI[randomIndex]);
  };

  const endedAudio = () => {
    if (!audioRef.current) return;
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play(); // nên play lại
      return;
    } else if (isRandom) {
      handleRandom();
    } else {
      handleNext();
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const value = Number(e.target.value);
      audioRef.current.volume = value / 100;
      setVolume(value);
    }
  };

  const mutedVolume = () => {
    if (volume === 0) {
      setVolume(100);
    } else {
      setVolume(0);
    }
  };

  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = volume / 100;
  }
}, [volume]);

  useEffect(()=>{
    hydrateFromStorage()
  },[])

  return (
    <div
      className={`fixed transition-transform duration-300 ease-in-out h-22 ${currentSongAPI ? "translate-y-0" : "translate-y-full"} bottom-0 w-full bg-black z-50`}
    >
      <div className=" w-[95%] mx-auto flex items-center justify-between py-3">
        {/* Song image */}
<<<<<<< HEAD
        <div className="w-[300px] hidden md:flex md:items-center gap-2 ">
=======
        <div className="w-75 hidden md:flex md:items-center gap-2 ">
>>>>>>> 4c8d154 (comeback)
          <Image
            alt="cover-11"
            src={currentSongAPI?.image_music || ""}
            className="size-14 rounded-lg object-cover"
            width={500}
            height={500}
          />
          <div className="">
            <h2 className="text-primary-text font-bold line-clamp-1">
              {currentSongAPI?.name_music}
            </h2>
            <span className="text-secondary-text font-semibold">
              {currentSongAPI?.name_singer}
            </span>
          </div>
        </div>
        {/* Song controllers */}
<<<<<<< HEAD
        <div className="flex flex-col items-center gap-2 w-[300px] md:w-[600px]">
=======
        <div className="flex flex-col items-center gap-2 w-75 md:w-150">
>>>>>>> 4c8d154 (comeback)
          {/* audio controllers */}
          <div className="flex items-center gap-5">
            <button
              onClick={handleShuffle}
              className="hover:scale-110 hover:cursor-pointer transition"
            >
              <CiShuffle
                className={`${
                  isRandom ? "text-green-500" : "text-zinc-400"
                } text-xl`}
              />
            </button>
            <button
              onClick={handlePrev}
              className="hover:scale-110 hover:cursor-pointer transition"
            >
              <FaStepBackward className="text-zinc-400 text-xl" />
            </button>
            <button
              onClick={handlePlay}
              className="hover:scale-110 hover:cursor-pointer transition"
            >
              {isPlaying ? (
                <FaPauseCircle className="text-white text-3xl" />
              ) : (
                <FaPlayCircle className="text-white text-3xl" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="hover:scale-110 hover:cursor-pointer transition"
            >
              <FaStepForward className="text-zinc-400 text-xl" />
            </button>
            <button
              onClick={handleRepeat}
              className="hover:scale-110 hover:cursor-pointer transition"
            >
              <FaRepeat
                className={`${
                  isRepeat ? "text-green-500" : "text-zinc-400"
                } text-xl`}
              />
            </button>
          </div>

          {/* audio process */}
          <div className="flex items-center gap-2 w-full">
<<<<<<< HEAD
            <span className="text-zinc-400 text-xs w-[40px] text-right">
=======
            <span className="text-zinc-400 text-xs w-10 text-right">
>>>>>>> 4c8d154 (comeback)
              {formatTime(Number(audioRef.current?.currentTime || 0))}
            </span>
            <input
              type="range"
              value={process}
              onChange={handleSeek}
              className="range-player w-full outline-none"
              style={{
                background: `linear-gradient(to right, #1db954 ${process}%, #444 ${process}%)`,
              }}
            />
<<<<<<< HEAD
            <span className="text-zinc-400 text-xs w-[40px]">
=======
            <span className="text-zinc-400 text-xs w-10">
>>>>>>> 4c8d154 (comeback)
              {formatTime(Number(audioRef.current?.duration || 0))}
            </span>
          </div>
        </div>
        {/* Right: Volume & Queue */}
        <div className="flex items-center gap-3">
          <button className="text-zinc-300 transition">
            <MdQueueMusic className="size-6" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={mutedVolume}
              className="text-zinc-300 hover:text-white hover:cursor-pointer"
            >
              {volume === 0 ? (
                <FaVolumeMute className="size-5" />
              ) : (
                <FaVolumeUp className="size-5" />
              )}
            </button>
            <input
              type="range"
              value={volume}
              onChange={handleVolume}
<<<<<<< HEAD
              className="w-[80px] hidden md:block h-1 accent-emerald-500 bg-zinc-700 rounded-lg hover:cursor-pointer"
=======
              className="w-20 hidden md:block h-1 accent-emerald-500 bg-zinc-700 rounded-lg hover:cursor-pointer"
>>>>>>> 4c8d154 (comeback)
            />
          </div>
        </div>

        {/* Audio tag */}
        <audio
          ref={audioRef}
          src={currentSongAPI?.src_music}
          onTimeUpdate={handleUpdateTime}
          onEnded={endedAudio}
        />
      </div>
    </div>
  );
}

export default MusicPlayer;
