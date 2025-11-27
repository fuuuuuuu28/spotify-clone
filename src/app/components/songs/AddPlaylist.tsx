import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuPlus } from "react-icons/lu";
import { usePlayerStore } from "@/stores/usePlayerStore";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

function AddPlaylist() {
  const { songsAPI, playlist, setPlaylist } = usePlayerStore();

  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 5;

  const totalPages = Math.ceil(songsAPI.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const songsPlaylist = songsAPI.slice(startIndex, startIndex + songsPerPage);

  // useEffect(() => {
  //   fetchPlaylist();
  // }, [fetchPlaylist]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <LuPlus className="text-secondary-text size-12 hover:bg-hover duration-300 rounded-full p-2 hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="w-[650px] max-h-[650px] bg-background-theme">
        <DialogHeader>
          <DialogTitle className="text-primary-text">Library</DialogTitle>
          <DialogDescription className="text-secondary-text">
            Add song for your library
          </DialogDescription>
          <Separator className="text-primary-text" />
        </DialogHeader>
        <div className="overflow-y-auto scroll h-[150px] space-y-3">
          {playlist?.songs.map((song) => (
            <div key={song._id} className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <Image
                  alt="songs"
                  src={song.image_music}
                  className="rounded-xl"
                  width={60}
                  height={60}
                />
                <div className="">
                  <h2 className="text-primary-text font-semibold">
                    {song.name_singer}{" "}
                  </h2>
                  <span className="text-secondary-text">
                    {song.name_music}{" "}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Separator className="text-primary-text" />
        <div className="space-y-2">
          {songsPlaylist.map((song) => (
            <div key={song._id} className="flex items-center justify-between">
              <div className="w-full flex items-center gap-2">
                <Image
                  alt="songs"
                  src={song.image_music}
                  className=""
                  width={60}
                  height={60}
                />
                <div className="">
                  <h2 className="text-primary-text font-semibold">
                    {song.name_singer}{" "}
                  </h2>
                  <span className="text-secondary-text">
                    {song.name_music}{" "}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPlaylist(song)}
                className="bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer"
              >
                Add to playlist
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-secondary-text">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer"
          >
            Next
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddPlaylist;
