"use client";

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
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    songs,
    setCurrentSong,
    songsAPI,
    currentSongAPI,
  } = usePlayerStore();

  const [process, setProcess] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isRandom, setIsRandom] = useState(false);

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
    if (audioRef.current) {
      setProcess(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const value = Number(e.target.value);
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
      setProcess(value);
    }
  };

  const handleNext = () => {
    const currentIndex = songsAPI.findIndex((s) => s._id === currentSong?._id);
    const nextIndex = (currentIndex + 1) % songsAPI.length;
    setCurrentSong(songsAPI[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = songsAPI.findIndex((s) => s._id === currentSong?._id);
    const prevIndex = (currentIndex - 1 + songsAPI.length) % songsAPI.length;
    setCurrentSong(songsAPI[prevIndex]);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleShuffle = () => {
    setIsRandom(!isRandom);
  };

  const handleRandom = () => {
    const currentIndex = songsAPI.findIndex((s) => s._id === currentSong?._id);
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songsAPI.length);
    } while (randomIndex === currentIndex);
    setCurrentSong(songsAPI[randomIndex]);
  };

  const endedAudio = () => {
    if (isRepeat) {
      audioRef.current?.play();
    }
    if (isRandom) {
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

  return (
    <div className="fixed bottom-0 w-full h-22 bg-black z-50">
      <div className="w-[95%] mx-auto flex items-center justify-between py-3">
        {/* Song image */}
        <div className="hidden md:flex md:items-center gap-2 ">
          <Image
            alt="cover-11"
            src={currentSongAPI?.image_music || ""}
            className="size-14 rounded-lg object-cover"
            width={500}
            height={500}
          />
          <div className="">
            <h2 className="text-primary-text font-bold line-clamp-1">
              {currentSongAPI?.name_singer}
            </h2>
            <span className="text-secondary-text font-semibold">
              {currentSongAPI?.name_music}
            </span>
          </div>
        </div>
        {/* Song controllers */}
        <div className="flex flex-col items-center gap-2 w-[300px] md:w-[600px]">
          {/* audio controllers */}
          <div className="flex items-center gap-5">
            <button
              onClick={handleShuffle}
              className="hover:scale-110 transition"
            >
              <CiShuffle
                className={`${
                  isRandom ? "text-green-500" : "text-zinc-400"
                } text-xl`}
              />
            </button>
            <button onClick={handlePrev} className="hover:scale-110 transition">
              <FaStepBackward className="text-zinc-400 text-xl" />
            </button>
            <button onClick={handlePlay} className="hover:scale-110 transition">
              {isPlaying ? (
                <FaPauseCircle className="text-white text-3xl" />
              ) : (
                <FaPlayCircle className="text-white text-3xl" />
              )}
            </button>
            <button onClick={handleNext} className="hover:scale-110 transition">
              <FaStepForward className="text-zinc-400 text-xl" />
            </button>
            <button
              onClick={handleRepeat}
              className="hover:scale-110 transition"
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
            <span className="text-zinc-400 text-xs w-[40px] text-right">
              {formatTime(Number(audioRef.current?.currentTime || 0))}
            </span>
            <input
              type="range"
              value={process}
              onChange={handleSeek}
              // className="w-full h-1 rounded-lg accent-white bg-zinc-700"
              className="range-player w-full outline-none h-2 bg-zinc-700 rounded-md accent-emerald-500 appearance-none"
            />
            <span className="text-zinc-400 text-xs w-[40px]">
              {formatTime(Number(audioRef.current?.duration || 0))}
            </span>
          </div>
        </div>
        {/* Right: Volume & Queue */}
        <div className="flex items-center gap-3">
          <button className="text-zinc-300 hover:text-white transition">
            <MdQueueMusic className="size-6" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={mutedVolume}
              className="text-zinc-300 hover:text-white"
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
              className="w-[80px] hidden md:block h-1 accent-emerald-500 bg-zinc-700 rounded-lg"
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
