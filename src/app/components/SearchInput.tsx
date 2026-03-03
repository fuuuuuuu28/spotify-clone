import React, { useState } from "react";
import { useDebounce } from "./utils/useDebounce";
import useSearchSong from "@/hooks/useSearchSong";
import { GoSearch } from "react-icons/go";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { SongAPI } from "@/types/type";
import { usePlayerStore } from "@/stores/usePlayerStore";

type SearchInputType={
  keyword:string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  open:boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data:SongAPI[] | undefined;
  isLoading: boolean;
  setCurrentSong:(song:SongAPI) => void;
}
function SearchInput({keyword, setKeyword, open,setOpen, data, isLoading, setCurrentSong}: SearchInputType) {
  // const [keyword, setKeyword] = useState("");
  // const [open, setOpen] = useState(false);

  // const debounceKeyword = useDebounce(keyword, 300);

  // const { data, isLoading } = useSearchSong(debounceKeyword);
  //   const { setCurrentSong } = usePlayerStore();

    const arraySkeleton = Array.from({ length: 5 });
  return (
    <>
      {/* Search function */}
      <div className="bg-background-theme hidden lg:flex items-center h-11 w-90 px-2 gap-3 text-primary-text rounded-full hover:bg-hover duration-300">
        <GoSearch className="text-primary-text shrink-0" size={25} />
        <input
          className="h-full w-full outline-none placeholder:text-white"
          type="text"
          placeholder="What do you want to play?"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          // onKeyPress={handlePress}
        />
      </div>
      {/* Render kết quả */}
      <div
        onMouseDown={(e) => e.preventDefault()}
        className="absolute top-16 left-16 w-[500px] bg-black max-h-50 overflow-y-auto scroll rounded-b-xl"
      >
        {/* Có keyword → hiện search */}
        {open &&
          keyword.trim() !== "" &&
          (isLoading ? (
            <div>
              {arraySkeleton.map((_, index) => (
                <div className="flex items-center gap-4 bg-background-theme m-4 p-4 text-secondary-text rounded-lg my-2">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="w-60 h-5" />
                </div>
              ))}
            </div>
          ) : data?.length == 0 ? (
            <div className="text-center text-secondary-text p-4">
              Không tìm thấy bài hát nào.
            </div>
          ) : (
            data?.map((song: SongAPI) => (
              <div
                key={song._id}
                onClick={() => {
                  setCurrentSong(song);
                  setOpen(false);
                }}
                className="flex items-center gap-4 bg-background-theme m-4 p-4 text-secondary-text rounded-lg my-2 hover:bg-hover hover:cursor-pointer"
              >
                <Image
                  src={song.image_music}
                  alt="music"
                  className="size-10"
                  width={500}
                  height={500}
                />
                <span>
                  {song.name_music} – {song.name_singer}
                </span>
              </div>
            ))
          ))}
      </div>
    </>
  );
}

export default SearchInput;
