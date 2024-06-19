import { song } from "./song";

export interface gender {
    genderId: number;
    name: string;
    topSongs: song[] | null;
}