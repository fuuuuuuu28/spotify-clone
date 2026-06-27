"use server";

export async function fetchSongs(page: number = 1) {
  try {
    const res = await fetch(
      `https://v2-api-kaito-music.vercel.app/api/music/top-views?_limit=20&_page=${page}&_type=million`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      console.error("fetchSongs failed:", res.status);
      return [];
    }

    const data = await res.json();
    return data?.data ?? [];
  } catch (error) {
    console.error("fetchSongs error:", error);
    return [];
  }
}

export async function fetchRandomSong() {
  try {
    const randomPage = Math.floor(Math.random() * 15) + 1;
    // console.log("first", randomPage);
    const res = await fetch(
      `https://v2-api-kaito-music.vercel.app/api/music/top-views?_limit=20&_page=${randomPage}&_type=million`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data?.data ?? [];
  } catch (error) {
    console.error("fetchRandomSong error:", error);
    return [];
  }
}

export async function fetchSearch(query: string) {
  if (!query.trim()) return [];

  try {
    const res = await fetch(
      `https://v2-api-kaito-music.vercel.app/api/search?query=${encodeURIComponent(
        query,
      )}&_limit=5&_page=1`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data?.data ?? [];
  } catch (error) {
    console.error("fetchSearch error:", error);
    return [];
  }
}

export async function fetchSongByArtist(artist: string) {
  try {
    const res = await fetch(
      `https://v2-api-kaito-music.vercel.app/api/music/get-singer-name?_singer=${encodeURIComponent(
        artist,
      )}&_page=1&_limit=20`,
      { next: { revalidate: 60 } },
    );

    if(!res.ok) return[];
    
    const data = await res.json();
    return data?.data??[];
  } catch (error) {
    console.error("fetchSongByArtist:",error);
    return [];
  }
}
