import { Component } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { SongService } from '../../services/song.service';
import { UserService } from '../../services/user.service';
import { enviroments } from '../../../enviroments/enviroments';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  src!: string;
  user!: any;
  backupsrc: string = '../../../assets/images/profile-icon.png';
  artistPool = [
    // Latinos
    160, // Shakira
    4345, // Soda Stereo
    6707, // Luis Fonsi
    3839, // Daddy Yankee
    10583405, // Bad Bunny
    8798, // Vicente Fernandez
    554622, // Tronic
    4115, // Maná
    1215236, // La Nomchem
    1272674, // Romeo Santos
    4939, // Los Prisioneros
    // Gringos
    458, // SOAD
    145, // Beyoncé
    1, // The Beatles
    399, // Radiohead
    12246, // Taylor Swift
    119, // Metallica
    719, // Bob Marley
    525046, // Kendrick Lamar
    290, // Madonna
    617 // Frank Sinatra
  ];
  searchingSong: boolean = false;
  recommendedList: any[] = [];
  songList: any[] = [];
  songSelected!: any;
  buscador: FormGroup;

  onImageError(){
    this.src = this.backupsrc;
  }

  constructor(private artistService: ArtistService,
    private userService: UserService, 
    private formBuilder: FormBuilder,
    private songService: SongService) {
    this.buscador = this.formBuilder.group({
      song: ['', Validators.required]
    });
  }

  ngOnInit(){
    this.getUser();
    for(let i = 0; i < 5; i++){
      let id = Math.floor(Math.random() * 21);
      this.getArtist(this.artistPool[id]);
    }
  }

  getArtist(id: number){
    this.artistService.get50Songs(id).subscribe({
      next: (result) => {
        let topArtistSongs = result;
        let randomIndex = Math.floor(Math.random() * 50);
        this.recommendedList.push(topArtistSongs[randomIndex]);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getUser(){
    this.userService.getUserProfile().subscribe({
      next: (result) => {
        this.user = result;
        this.src = enviroments.apiConnect.photo + "/" + this.user.userId;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  search(){
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
  }

  select(index: number){
    this.songSelected = this.songList[index];
    this.searchingSong = false;
  }

  searchMenu(){
    this.searchingSong = true;
  }

}
