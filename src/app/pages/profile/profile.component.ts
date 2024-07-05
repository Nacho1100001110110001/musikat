import { Component } from '@angular/core';
import { gender } from '../../../models/gender';
import { artist } from '../../../models/artist';
import { song } from '../../../models/song';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
import { GenderService } from '../../services/gender.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { post } from '../../../models/post';


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
   SinglePost!: post;
   Posts!: post[];

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  constructor(private songService: SongService,
    private artistService: ArtistService,
    private postService: PostService,
    private genderService: GenderService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.getPosts();
    this.getPostById();
    this.getSong();
    this.getArtist();
    this.getGender();
  }

  ngOnInit(){
    this.route.params.subscribe((params) =>{
      this.userProfile= true;
     this.notFound = false;
     this.friend = false;
     this.followed = false;
     this.blocked = false;
      this.getUser();
      let username = params['nombre'];
      if(!username || username == this.user.username) {
        this.userProfile = true;
        return;
      }
      this.userProfile = false;
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
        if(this.user){
          if(this.user.friends.find((user: { userId: any; }) => user.userId == result.userId)) this.friend = true;
          if(this.user.followed.find((user: { userId: any; }) => user.userId == result.userId)) this.followed = true;
          if(this.user.blocked.find((user: { userId: any; }) => user.userId == result.userId)) this.blocked = true;
        }
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

  getPostById(){
    let post= this.postService.getPostById(3);
    if(post) this.SinglePost= post;
  }

  getPosts(){
    let posts= this.postService.getPosts();
    if(posts) this.Posts= posts;
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

  // Añade trackByPostId
  trackByPostId(index: number, post: post): number {
    return post.postId;
  }
}
