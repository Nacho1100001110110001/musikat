import { Component } from '@angular/core';
import { ArtistService } from '../../services/artist.service';
import { SongService } from '../../services/song.service';
import { UserService } from '../../services/user.service';
import { enviroments } from '../../../enviroments/enviroments';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';

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
  publicacionesList: any[] = [];
  songSelected!: any;
  buscador: FormGroup;
  publicacion: FormGroup;
  commentgroup: FormGroup;
  preferences!: any;

  onImageError(event: any){
    event.target.src = this.backupsrc;
  }

  getSrc(id: number){
    return enviroments.apiConnect.photo + "/" + id;
  }

  constructor(private artistService: ArtistService,
    private userService: UserService, 
    private formBuilder: FormBuilder,
    private songService: SongService,
    private postService: PostService) {
    this.buscador = this.formBuilder.group({
      song: ['', Validators.required]
    });
    this.publicacion = this.formBuilder.group({
      publicacioncuerpo: ['', [Validators.required, Validators.maxLength(255)]]
    })
    this.commentgroup = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(255)]]
    })
  }

  ngOnInit(){
    this.getUser();
    this.getFeed();
    this.getPreferences();
  }

  getPreferences(){
    this.userService.getPreferences().subscribe({
      next: (result) => {
        this.preferences = result;
        console.log(this.preferences)
        for(let i = 0; i < 5; i++){
          if(this.preferences.likedArtists[i]){
            let id = Math.floor(Math.random() * this.preferences.likedArtists.length);
            this.getArtist(this.preferences.likedArtists[id]);
          }else{
            let id = Math.floor(Math.random() * 21);
            this.getArtist(this.artistPool[id]);
          }
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  isSongLiked(id: number){
    let lista: any[] = this.preferences.likedSongs;
    return lista.find((song: string) => song == id + "" );
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

  publicar(){
    if(!this.publicacion.valid) {
      alert('El comentario debe ser menor a 255 carácteres y no puede ser vacio');
      return;
    }
    if(!this.songSelected){
      alert('Debes seleccionar una canción');
      return;
    }

    let post = {artistId: this.songSelected.artist.id + "",
      songId: this.songSelected.id + "",
      content: this.publicacion.value.publicacioncuerpo
    }

    this.postService.postPublication(post).subscribe({
      next: (result) => {
        console.log(result)
        this.songSelected = null;
        this.searchingSong = false;
        this.publicacion.reset();
        this.publicacionesList.unshift(result)
        this.getSongById(result.songId, 0);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  play(index: number){
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

  getFeed(){
    this.postService.getFeed().subscribe({
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

  likeSong(id: number){
    console.log(this.preferences.likedSongs)
    this.songService.likeSong(id).subscribe({
      next: (result) => {
        if(result.like){
          this.preferences.likedSongs.push(id + "")
        }else{
          this.preferences.likedSongs = this.removerObjeto(this.preferences.likedSongs, id + "")
        }
        console.log(this.preferences.likedSongs)
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  removerObjeto<T>(lista: T[], objetoAEliminar: T): T[] {
    return lista.filter(item => item !== objetoAEliminar);
  }

}
