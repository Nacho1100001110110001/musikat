import { Component } from '@angular/core';
import { gender } from '../../../models/gender';
import { artist } from '../../../models/artist';
import { song } from '../../../models/song';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
import { GenderService } from '../../services/gender.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
   userProfile: boolean = true;
   friend: boolean = true;
   selectedTab: string = 'song';

   favoriteGender!: gender;
   favoriteArtist!: artist;
   favoriteSong!: song;

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  constructor(private songService: SongService,
    private artistService: ArtistService,
    private genderService: GenderService,
    private router: Router
  ){
    this.getSong();
    this.getArtist();
    this.getGender();
  }

  getSong(){
    let song = this.songService.getSong(1);
    if(song) this.favoriteSong = song;
  }

  getArtist(){
    let artist = this.artistService.getArtist(2);
    if(artist) {
      this.favoriteArtist = artist;
      this.favoriteArtist.songs = this.songService.getSongsByArtist(artist.artistId);
    }
  }

  getGender(){
    let gender = this.genderService.getGender(1);
    if(gender) {
      this.favoriteGender = gender;
      this.favoriteGender.topSongs = this.songService.getSongsByGenders(gender.genderId);
    }
  }

  editarPerfil(){
    this.router.navigate(['editar-perfil']);
  }
}
