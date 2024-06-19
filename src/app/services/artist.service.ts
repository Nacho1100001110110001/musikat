import { Injectable } from '@angular/core';
import { artist } from '../../models/artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  artists: artist[] = [{
    artistId: 1,
    name: "Mago de Oz",
    image: "",
    songs: null
  },{
    artistId: 2,
    name: "Soda Stereo",
    image: "../../../assets/images/sodastereo.jpg",
    songs: null
  },{
    artistId: 3,
    name: "Los Enanitos Verdes",
    image: "",
    songs: null
  }]
  constructor() { }

  getArtist(id: number): artist | null{
    let foundedArtist = this.artists.find(artist => artist.artistId == id);
    if(foundedArtist !== undefined) return foundedArtist;
    return null;
  }
}
