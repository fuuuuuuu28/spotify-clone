import React, { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { LuPlus } from "react-icons/lu";
import { usePlayerStore } from "@/stores/usePlayerStore";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

function AddPlaylist() {
  const { songs, playlist,setPlaylist, fetchPlaylist } = usePlayerStore();

  useEffect(()=>{
    fetchPlaylist()
  },[fetchPlaylist])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <LuPlus className="text-secondary-text size-12 hover:bg-hover duration-300 rounded-full p-2" />
      </DialogTrigger>
      <DialogContent className="max-w-[650px] bg-background-theme">
        <DialogHeader>
          <DialogTitle className="text-primary-text">Library</DialogTitle>
          <DialogDescription className="text-secondary-text">
            Add song for your library
          </DialogDescription>
          <Separator className="text-primary-text"/>
        </DialogHeader>
        {playlist?.songs.map((song) => (
          <div key={song._id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                alt="songs"
                src={song.imageUrl}
                className=""
                width={60}
                height={60}
              />
              <div className="">
                <h2 className="text-primary-text font-semibold">
                  {song.artist}{" "}
                </h2>
                <span className="text-secondary-text">{song.title} </span>
              </div>
            </div>
          </div>
        ))}
        <Separator className="text-primary-text"/>
        {songs.map((song) => (
          <div key={song._id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                alt="songs"
                src={song.imageUrl}
                className=""
                width={60}
                height={60}
              />
              <div className="">
                <h2 className="text-primary-text font-semibold">
                  {song.artist}{" "}
                </h2>
                <span className="text-secondary-text">{song.title} </span>
              </div>
            </div>
            <button onClick={() => setPlaylist(song._id)} className="bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer">Add to playlist</button>
          </div>
        ))}
        {/* <DialogFooter>
          <DialogClose asChild>
            <button className="bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer">
              Cancel
            </button>
          </DialogClose>
          <button className="bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer">
            Add
          </button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default AddPlaylist;
