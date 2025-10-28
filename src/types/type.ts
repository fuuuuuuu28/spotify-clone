export type Song = {
    _id:string,
    title:string,
    artist:string,
    imageUrl:string,
    audioUrl:string,
    user_id:string,
}

export type SongAPI ={
    _id:string,
    name_music:string,
    name_singer:string,
    image_music:string,
    src_music:string,
}

export type Playlist = {
    _id:string,
    songs: SongAPI[],
    user_id: string,
}