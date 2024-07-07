import { Component, ElementRef, ViewChild } from '@angular/core';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  favoriteArtist!: any;
  favoriteSong!: any;
  topArtistSongs!: any;
  formUser: FormGroup;
  user!: any;
  seacrhing: boolean[] = [false, false]; // song, artist
  songList!: any;
  artistList!: any;
  buscador: FormGroup;

  selectedTab: string = 'song';
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private songService: SongService,
    private artistService: ArtistService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ){
    this.formUser = this.formBuilder.group({
      username:['',[Validators.required]]
    })
    this.buscador = this.formBuilder.group({
      song:['', Validators.required],
      artist:['', Validators.required]
    })

    this.getUser();
  }

  getUser(){
    this.userService.getUserProfile().subscribe({
      next: (result) => {
        this.user = result;
        this.formUser.patchValue(result);
        if(this.user.favoriteSong){
          this.getSong();
        }
        if(this.user.favoriteArtist){
          this.getArtist();
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  updateUser(){
    let user: any = {username: this.formUser.value.username};
    if(this.favoriteSong) user.favoriteSong = this.favoriteSong.id + "";
    if(this.favoriteArtist) user.favoriteArtist = this.favoriteArtist.id + "";
    console.log(user);
    this.userService.updateUser(user).subscribe({
      next: (result) => {
        console.log(result);
        this.router.navigate(["perfil"])
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getSong(){
    this.songService.getSongById(this.user.favoriteSong).subscribe({
      next: (result) => {
        this.favoriteSong = result;
        console.log(result);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getArtist(){
    this.artistService.getArtistById(this.user.favoriteArtist).subscribe({
      next: (result) => {
        this.favoriteArtist = result;
        console.log(result);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getArtistTopSongs(){
    this.artistService.getTopSongs(this.user.favoriteArtist).subscribe({
      next: (result) => {
        this.topArtistSongs = result;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  triggerClick(){
    this.fileInput.nativeElement.click();
  }

  cancelar(){
    window.history.back();
  }

  search(index: number){
    this.seacrhing[index] = true;
    if(index == 0){
      let name: string = this.buscador.value.song;
      this.songService.searchSongs(name).subscribe({
        next: (result) => {
          this.songList = result.data;
          console.log(result);
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {},
      });
    }else{
      let name: string = this.buscador.value.artist;
      this.artistService.searchArtist(name).subscribe({
        next: (result) => {
          this.artistList = result.data;
          console.log(result);
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {},
      });
    }
    
  }

  select(index: number, id: number){
    if(index == 0){
      for(let song of this.songList){
        if(song.id == id) this.favoriteSong = song;
      }
    }else{
      for(let artist of this.artistList){
        if(artist.id == id) this.favoriteArtist = artist;
      }
    }
  }
}
