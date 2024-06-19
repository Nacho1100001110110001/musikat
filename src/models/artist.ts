import { song } from "./song";

export interface artist {
    artistId: number;
    name: string;
    image: string;
    songs: song[] | null;
}