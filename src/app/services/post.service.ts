import { Injectable } from '@angular/core';
import { post } from '../../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: post[] = [{
    postId: 1,
    image: "../../../assets/images/magodioz.jpg",
    content: "Hola jovenes, hoy es un buen dia para morir",
    comment:"",
  },{
    postId: 2,
    image: "../../../assets/images/kinder.jpg",
    content: "a que ora dentran los del kinder",
    comment:"",
  },{
    postId: 3,
    image: "../../../assets/images/golosakinder.jpg",
    content: "a la ora del piko kmo te gusta goloza",
    comment:"",
  },{
    postId: 4,
    image: "../../../assets/images/dariusmeme.jpg",
    content: "Rinde darius full ad?",
    comment:"",
  },{
    postId: 5,
    image: "../../../assets/images/friki.jpg",
    content: "Aqui pasando el rato en frikigram",
    comment:"",
  },

  ];
  constructor() { }

  getPostById(id: number): post | null{
    let foundedPost = this.posts.find(post => post.postId == id);
    if(foundedPost !== undefined) return foundedPost;
    return null;
  }
  getPosts(){
    return this.posts;
  }
}
