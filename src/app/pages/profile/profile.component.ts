import { Component } from '@angular/core';
import { SongService } from '../../services/song.service';
import { ArtistService } from '../../services/artist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { enviroments } from '../../../enviroments/enviroments';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
  src!: string;
  backupsrc: string = '../../../assets/images/profile-icon.png';
  username!: string;
  playing: boolean = false;

  onImageError(event: any){
    event.target.src = this.backupsrc;
  }

  favoriteSong!: any;
  favoriteArtist!: any;
  topArtistSongs!: any;
  publicacionesList: any[] = [];
  commentgroup: FormGroup;

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  constructor(private songService: SongService,
    private artistService: ArtistService,
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ){
    this.commentgroup = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(255)]]
    })
   }

  ngOnInit(){
    this.route.params.subscribe((params) =>{
      this.userProfile= true;
      this.notFound = false;
      this.friend = false;
      this.followed = false;
      this.blocked = false;
      this.getUser();
      this.username = params['nombre'];
      
    });
    
  }

  getUser(){
    this.userService.getUserProfile().subscribe({
      next: (result) => {
        this.user = result;
        if(this.username && this.username != this.user.username) {
          this.userProfile = false;
          this.getUserByName(this.username);
          return;
        }
        this.userProfile = true;
        
        if(this.user.favoriteSong){
          this.getSong();
        }
        if(this.user.favoriteArtist){
          this.getArtist();
        }
        this.src = enviroments.apiConnect.photo + "/" + this.user.userId;
        this.getPosts();
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
        }
        this.user = result;
        if(this.user.favoriteSong){
          this.getSong();
        }
        if(this.user.favoriteArtist){
          this.getArtist();
        }
        this.src = enviroments.apiConnect.photo + "/" + this.user.userId;
        this.getPosts();
      },
      error: (error) => {
        this.notFound = true;
        console.error(error)
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

  play(){
    this.playing = !this.playing;
    const audio: any = document.getElementById('audio');
    audio.volume = 0.1
    if(audio?.paused){
      audio.play()
    }else{
      audio.pause()
    }

    audio.addEventListener('ended', () => {
      this.playing = false;
    });

    audio.addEventListener('pause', () => {
      this.playing = false;
    });
  }

  playWI(index: number){
    this.publicacionesList[index].playing = !this.publicacionesList[index].playing;
    const audio: any = document.getElementById(index + "");
    audio.volume = 0.1
    if(audio?.paused){
      audio.play()
    }else{
      audio.pause()
    }

    audio.addEventListener('ended', () => {
      this.publicacionesList[index].playing = false;
    });
  }

  getSrc(id: number){
    return enviroments.apiConnect.photo + "/" + id;
  }

  deletePublication(index: number){
    const borrar = confirm("¿Deseas eliminar esta publicación?");
    if(!borrar) return;
    this.postService.deletePublication(this.publicacionesList[index]._id).subscribe({
      next: (result) => {
        console.log(result)
        this.publicacionesList.splice(index, 1);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  likePublication(index: number){
    this.postService.likePublication(this.publicacionesList[index]._id).subscribe({
      next: (result) => {
        this.publicacionesList[index].liked = result.like;
        this.publicacionesList[index].likeCount = result.likeCount;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  showComment(index: number){
    const commentDiv: any = document.getElementById('comment-' + index);
    commentDiv.addEventListener('change', function(){
      commentDiv.scrollTop = commentDiv.scrollHeight;
    })
    this.publicacionesList[index].showComment = !this.publicacionesList[index].showComment;
  }

  postComment(index: number, event: any){
    this.commentgroup.get('comment')?.setValue(event.target.value)
    if(!this.commentgroup.valid){
      alert('El comentario debe ser menor a 255 carácteres y no puede ser vacio');
      return;
    }

    this.postService.commentPublication(this.publicacionesList[index]._id, this.commentgroup.value.comment).subscribe({
      next: (result) => {
        this.publicacionesList[index].comments = result.comments;
        this.publicacionesList[index].showComment = true;
        event.target.value = ""
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getPosts(){
    this.postService.getPublicationsById(this.user.userId).subscribe({
      next: (result) => {
        this.publicacionesList = result;
        for(let i = 0; i< this.publicacionesList.length; i ++){
          this.publicacionesList[i].playing = false;
          this.publicacionesList[i].showComment = false;
          this.getSongById(this.publicacionesList[i].songId, i);
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getSongById(id: number, index: number){
    this.songService.getSongById(id).subscribe({
      next: (result) => {
        this.publicacionesList[index].song = result;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  // Friends section
  addFriend(){
    this.userService.addFriend(this.user.userId).subscribe({
      next: (result) => {
        this.user.status = result.status;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  cancelSolicitude(){
    this.userService.cancelSolicitude(this.user.userId).subscribe({
      next: (result) => {
        this.user.status = result.status;
        console.log(result)
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  acceptSoli(){
    this.userService.acceptSolicitude(this.user.userId).subscribe({
      next: (result) => {
        this.user.status = 'friend';
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  rejectSoli(){
    this.userService.rejectSolicitude(this.user.userId).subscribe({
      next: (result) => {
        this.user.status = 'nothing';
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  removeFriend(){
    const borrar = confirm("¿Deseas eliminar amigo?");
    if(!borrar) return;
    this.userService.deleteFriend(this.user.userId).subscribe({
      next: (result) => {
        this.user.status = 'nothing';
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }
}
