import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtistSongs } from "@/hooks/useArtistSong";
import { SongAPI } from "@/types/type";
import Image from "next/image";
import React, { useRef, useState } from "react";

function ArtistSongPopover({ artist }: { artist: string }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { data, isLoading } = useArtistSongs(artist, open);

  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const openPopover = (e: React.MouseEvent) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    setTimeout(() => {
      setPosition({
        x: e.clientX + 12,
        y: e.clientY + 12,
      });
      setOpen(true);
<<<<<<< HEAD
    }, 2000);
=======
    }, 1000);
>>>>>>> 4c8d154 (comeback)
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 120);
  };
  // console.log("first", data)

  const songsByArtist = data?.slice(0, 5);
  return (
    <>
      <span
        onMouseEnter={openPopover}
        onMouseLeave={scheduleClose}
        className="hover:underline cursor-pointer"
      >
        {artist}
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverContent
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
          }}
          className="w-80 bg-background-theme"
          onMouseEnter={() => {
            if (closeTimer.current) {
              clearTimeout(closeTimer.current);
            }
          }}
          onMouseLeave={scheduleClose}
        >
          <h4 className="font-semibold text-primary-text mb-2">
            Songs by {artist}
          </h4>

          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="space-y-2 max-h-40  overflow-y-auto scroll">
              {songsByArtist?.map((song: SongAPI) => (
                <div
                  key={song._id}
                  //   onClick={() => setCurrentSong(song)}
                  className="flex gap-2 items-center cursor-pointer hover:bg-hover p-2 rounded"
                >
                  <Image
                    src={song.image_music}
                    alt="asdasda"
                    width={500}
                    height={500}
                    className="rounded size-10"
                  />
                  <div className="flex-1">
                    <p className="text-primary-text text-sm truncate">
                      {song.name_music}
                    </p>
                    <p className="text-secondary-text text-xs truncate">
                      {song.name_singer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}

export default ArtistSongPopover;
