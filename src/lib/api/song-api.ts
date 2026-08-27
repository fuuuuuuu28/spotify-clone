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
    const totalPages = 15;

    // 1. Tạo một mảng chứa 15 promise fetch tương ứng với 15 trang
    const fetchPromises = Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;
      return fetch(
        `https://v2-api-kaito-music.vercel.app/api/music/top-views?_limit=20&_page=${page}&_type=million`,
        { next: { revalidate: 60 } },
      ).then((res) => (res.ok ? res.json() : null));
    });
    // 2. Chạy đồng thời tất cả các request
    const results = await Promise.all(fetchPromises);
    // console.log("res: ",results)

    // 3. Gộp tất cả các mảng dữ liệu (data.data) từ các trang lại làm một
    let allSongs: unknown[] = [];
    for (const result of results) {
      if (result && result.data) {
        allSongs = allSongs.concat(result.data);
      }
    }
    // console.log("pre allsongs: ",allSongs)

    // 4. Trộn ngẫu nhiên vị trí các phần tử bằng thuật toán Fisher-Yates
    for (let i = allSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSongs[i], allSongs[j]] = [allSongs[j], allSongs[i]]; // Đổi chỗ 2 phần tử
    }
    // console.log("allsong: ",allSongs)
    return allSongs.slice(0, 20); // Lấy 20 bài hát ngẫu nhiên
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

    if (!res.ok) return [];

    const data = await res.json();
    return data?.data ?? [];
  } catch (error) {
    console.error("fetchSongByArtist:", error);
    return [];
  }
}
