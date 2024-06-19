import { Component, ElementRef, ViewChild } from '@angular/core';
import { gender } from '../../../models/gender';
import { artist } from '../../../models/artist';
import { song } from '../../../models/song';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
import { GenderService } from '../../services/gender.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  favoriteGender!: gender;
  favoriteArtist!: artist;
  favoriteSong!: song;
  formUser: FormGroup;

  selectedTab: string = 'song';
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private songService: SongService,
    private artistService: ArtistService,
    private genderService: GenderService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ){
    this.formUser = this.formBuilder.group({
      username:['',[Validators.required]],
      birthDate: ['',[Validators.required]]
    })

    this.getSong();
    this.getArtist();
    this.getGender();
    this.getUser();
  }

  getUser(){
    this.userService.getUserProfile().subscribe({
      next: (result) => {
        this.formUser.patchValue(result);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  updateUser(){
    let user = {username: this.formUser.value.username, birthDate: this.formUser.value.birthDate};
    this.userService.updateUser(user).subscribe({
      next: (result) => {
        location.reload();
        console.log(result);
      },
      error: (error) => {
        console.error(error);
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

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  triggerClick(){
    this.fileInput.nativeElement.click();
  }

  cancelar(){
    window.history.back();
  }
}
