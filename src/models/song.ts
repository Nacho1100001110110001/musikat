import { artist } from "./artist";
import { gender } from "./gender";

export interface song {
    songId: number;
    name: string;
    image: string;
    artist: artist | null;
    gender: gender | null;
}