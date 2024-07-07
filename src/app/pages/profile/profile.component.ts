import { Component } from '@angular/core';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
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

   favoriteSong!: any;
   favoriteArtist!: any;
   topArtistSongs!: any;
   SinglePost!: post;
   Posts!: post[];

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  constructor(private songService: SongService,
    private artistService: ArtistService,
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ){ }

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
        if(this.user.favoriteSong){
          this.getSong();
        }
        if(this.user.favoriteArtist){
          this.getArtist();
        }
        this.getPosts();
        this.getPostById();
        console.log(this.user)
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
        if(this.user.favoriteSong){
          this.getSong();
        }
        if(this.user.favoriteArtist){
          this.getArtist();
        }
        this.getPosts();
        this.getPostById();
      },
      error: (error) => {
        this.notFound = true;
      },
      complete: () => {},
    });
  }

  getSong(){
    this.songService.getSongById(this.user.favoriteSong).subscribe({
      next: (result) => {
        this.favoriteSong = result;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
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
    this.artistService.getArtistById(this.user.favoriteArtist).subscribe({
      next: (result) => {
        this.favoriteArtist = result;
        this.getArtistTopSongs();
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
        console.log(this.topArtistSongs)
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  editarPerfil(){
    this.router.navigate(['editar-perfil']);
  }

  // Añade trackByPostId
  trackByPostId(index: number, post: post): number {
    return post.postId;
  }
}
