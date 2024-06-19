import { Component } from '@angular/core';
import { gender } from '../../../models/gender';
import { artist } from '../../../models/artist';
import { song } from '../../../models/song';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
import { GenderService } from '../../services/gender.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
   userProfile: boolean = true;
   notFound: boolean = false;
   friend: boolean = false;
   followed: boolean = false;
   blocked: boolean = false;
   selectedTab: string = 'song';
   user!: any;

   favoriteGender!: gender;
   favoriteArtist!: artist;
   favoriteSong!: song;

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  constructor(private songService: SongService,
    private artistService: ArtistService,
    private genderService: GenderService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.getSong();
    this.getArtist();
    this.getGender();
    this.getUser();
  }

  ngOnInit(){
    this.route.params.subscribe((params) =>{
      let username = params['nombre'];
      if(!username || username == this.user.username) {
        this.userProfile = true;
        return;
      }

      this.getUserByName(username);
    });
  }

  getUser(){
    this.userService.getUserProfile().subscribe({
      next: (result) => {
        this.user = result;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getUserByName(username: string){
    this.userService.getUserByName(username).subscribe({
      next: (result) => {
        if(this.user.friends.find((user: { userId: any; }) => user.userId == result.userId)) this.friend = true;
        if(this.user.followed.find((user: { userId: any; }) => user.userId == result.userId)) this.followed = true;
        if(this.user.blocked.find((user: { userId: any; }) => user.userId == result.userId)) this.blocked = true;
        this.user = result;
      },
      error: (error) => {
        this.notFound = true;
      },
      complete: () => {},
    });
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
