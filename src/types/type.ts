export type Song = {
    _id:string,
    title:string,
    artist:string,
    imageUrl:string,
    audioUrl:string,
    user_id:string,
}

export type Playlist = {
    _id:string,
    songs: Song[],
    user_id: string,
}