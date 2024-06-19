import { Injectable } from '@angular/core';
import { song } from '../../models/song';
import { ArtistService } from './artist.service';
import { GenderService } from './gender.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  songs: song[] = [{
    songId: 1,
    name: "Hoy toca ser feliz",
    image: "../../../assets/images/magodioz.jpg",
    artist: null,
    gender: null
  },{
    songId: 2,
    name: "De música ligera",
    image: "../../../assets/images/cancion animal.png",
    artist: null,
    gender: null
  },{
    songId: 3,
    name: "Nada personal",
    image: "../../../assets/images/obras cumbres.jpg",
    artist: null,
    gender: null
  },{
    songId: 4,
    name: "En la ciudad de la furia",
    image: "../../../assets/images/en la ciudad de la furia.jpg",
    artist: null,
    gender: null
  },{
    songId: 5,
    name: "Persiana americana",
    image: "../../../assets/images/obras cumbres.jpg",
    artist: null,
    gender: null
  },{
    songId: 6,
    name: "Trátame suavemente",
    image: "../../../assets/images/sodaalbum.jpg",
    artist: null,
    gender: null
  },{
    songId: 7,
    name: "Mi primer día sin tí",
    image: "../../../assets/images/enanitosverdes.jpg",
    artist: null,
    gender: null
  },{
    songId: 8,
    name: "Luz de Día",
    image: "../../../assets/images/enanitosverdes.jpg",
    artist: null,
    gender: null
  }];

  constructor(artistService: ArtistService, genderService: GenderService) {
    this.songs[0].artist = artistService.getArtist(1);
    for(let i = 1; i <= 5; i++){
      this.songs[i].artist = artistService.getArtist(2);
    }
    for(let i = 6; i <= 7; i++){
      this.songs[i].artist = artistService.getArtist(3);
    }
    this.songs[1].gender = genderService.getGender(1);
    this.songs[3].gender = genderService.getGender(1);
    for(let i = 5; i <= 7; i++){
      this.songs[i].gender = genderService.getGender(1);
    }
  }

  getSong(id: number): song | null{
    let foundedSong = this.songs.find(song => song.songId == id);
    if(foundedSong !== undefined) return foundedSong;
    return null;
  }

  getSongsByArtist(artistId: number): song[]{
    return this.songs.filter(song => song.artist?.artistId == artistId);
  }

  getSongsByGenders(genderId: number): song[]{
    return this.songs.filter(song => song.gender?.genderId == genderId);
  }
}
