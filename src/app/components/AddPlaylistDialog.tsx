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
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { SongAPI } from "@/types/type";
import { useAddToPlaylist, usePlaylist } from "@/hooks/useHandlePlaylist";
import { toast } from "sonner";
import { usePaginatedSongs } from "@/hooks/usePaginatedSongs";

function AddPlaylistDialog() {
  const [page, setPage] = useState(1);
  const { data: playlist } = usePlaylist();
  const { mutate: addSong, isPending, variables } = useAddToPlaylist();
  const { data:songPages, isFetching } = usePaginatedSongs(page);

  const totalPages = songPages?.totalPages ?? 1;
  // console.log("first: ",songs)

  const isAddingSong = (songId: string) =>
    isPending && variables?._id === songId;

  const handleAdd = (song: SongAPI) => {
    addSong(song, {
      onSuccess: (res) => {
        // server action trả string
        if (res === "Already have this song") {
          toast.warning(`"${song.name_music}" đã có trong playlist`);
          return;
        }
        toast.success(`Đã thêm "${song.name_music}" 🎵`);
      },

      onError: () => {
        toast.error("Thêm bài hát thất bại");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <LuPlus className="text-secondary-text size-12 hover:bg-hover duration-300 rounded-full p-2 hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="w-[650px] min-h-[650px] bg-background-theme">
        <DialogHeader>
          <DialogTitle className="text-primary-text">Library</DialogTitle>
          <DialogDescription className="text-secondary-text">
            Add song for your library
          </DialogDescription>
          <Separator className="text-primary-text" />
        </DialogHeader>
        <div className="overflow-y-auto scroll h-[150px] space-y-3">
          {playlist?.songs?.map((song) => (
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
                  <span className="text-primary-text font-semibold">
                    {song.name_music}{" "}
                  </span>
                  <h2 className=" text-secondary-text">{song.name_singer} </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Separator className="text-primary-text" />
        <div className="max-h-80 space-y-2 pr-2 overflow-y-auto scroll">
          {songPages?.map((song:SongAPI) => (
            <div key={song._id} className="flex items-center justify-between ">
              <div className="w-full flex items-center gap-2">
                <Image
                  alt="songs"
                  src={song.image_music}
                  className="size-15"
                  width={60}
                  height={60}
                />
                <div className="">
                  <span className="text-primary-text font-semibold">
                    {song.name_music}{" "}
                  </span>
                  <h2 className=" text-secondary-text">{song.name_singer} </h2>
                </div>
              </div>
              <div className="flex flex-col">
                {!playlist?.songs?.some((s) => s.externalId === song._id) &&
                
                (<button
                  onClick={() => handleAdd(song)}
                  disabled={isAddingSong(song._id)}
                  className="min-w-[120px] bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer"
                >
                  {isAddingSong(song._id) ? (
                    <Loader className="mx-auto size-5 animate-spin" />
                  ) : (
                    "Add to playlist"
                  )}
                </button>)
                }
                {/* {isLoading.playlistFetch.duplicated &&
                  isLoading.playlistFetch.duplicatedSongId === song._id && (
                    <span className="text-center text-sm text-red-400">
                      You already have this song
                    </span>
                  )} */}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={isFetching || page==1}
            className="bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer"
          >
            {isFetching ? <Loader className="animate-spin" /> : "Previous"}
          </button>
          <span className="text-secondary-text">
            Page {page}
          </span>
          <button
            onClick={() => setPage((p) =>  p + 1)}
            disabled={isFetching || page==15}
            className="bg-primary-text p-2 rounded-md hover:bg-secondary-text duration-300 cursor-pointer"
          >
            {isFetching ? <Loader className="animate-spin"/> :"Next"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddPlaylistDialog;
