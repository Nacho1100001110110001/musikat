import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
import { UserService } from '../../services/user.service';
import { enviroments } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  preferences!: any;
  personList!: any;
  busqueda!: any;
  playlistList!: any;
  songList!: any;
  artistList!: any;
  selectedTab: string = "person";
  index = 2;
  backupsrc: string = '../../../assets/images/profile-icon.png';

  onImageError(index: number){
    this.personList[index].src = this.backupsrc;
  }

  constructor(private songService: SongService,
    private artistService: ArtistService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ){ }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  ngOnInit(){

    this.route.params.subscribe((params) =>{
      this.busqueda = params['busqueda'];
      this.getPreferences();
    });
  }

  getPreferences(){
    this.userService.getPreferences().subscribe({
      next: (result) => {
        this.preferences = result;
        this.searchSong(this.busqueda);
        this.searchArtist(this.busqueda);
        this.searchPerson(this.busqueda);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  searchPerson(busqueda: string){
    busqueda.replace("%20", " ");
    this.userService.searchUser(busqueda).subscribe({
      next: (result) => {
        this.personList = result;
        for(let person of this.personList){
          person.src = enviroments.apiConnect.photo + "/" + person._id;
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  searchSong(busqueda: string){
    busqueda.replace("%20", " ");
    console.log(this.preferences)
    this.songService.searchSongs(busqueda).subscribe({
      next: (result) => {
        this.songList = result.data;
        for(let song of this.songList){
          song.liked = this.preferences.likedSongs.includes(song.id + "");
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  searchArtist(busqueda: string){
    busqueda.replace("%20", " ");
    this.artistService.searchArtist(busqueda).subscribe({
      next: (result) => {
        this.artistList = result.data;
        for(let artist of this.artistList){
          artist.liked = (this.preferences.likedArtists as any[]).includes(artist.id + "");
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  openProfile(name: string){
    this.router.navigate(["perfil/"+name]);
  }

  likeSong(index: number, id: number){
    this.songService.likeSong(id).subscribe({
      next: (result) => {
        this.songList[index].liked = result.like;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  likeArtist(index: number, id: number){
    this.artistService.likeArtist(id).subscribe({
      next: (result) => {
        this.artistList[index].liked = result.like;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }
}
