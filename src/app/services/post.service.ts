import { Injectable } from '@angular/core';
import { enviroments } from '../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

  getFeed(){
    const url = enviroments.apiConnect.feed;
    return this.http.get<any>(url, {withCredentials: true}).pipe(map((res: any)=>{
      return res.feed;
    }));
  }

  getPublicationsById(id: number){
    const url = enviroments.apiConnect.userPublications + "/" + id;
    return this.http.get<any>(url, {withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }

  postPublication(post: any){
    const url = enviroments.apiConnect.publication;
    return this.http.post<any>(url, post, {withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }

  likePublication(id: number){
    const url = enviroments.apiConnect.likePub + '/' + id;
    return this.http.put<any>(url, {id: id}, {withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }

  commentPublication(id: number, comment: string){
    const url = enviroments.apiConnect.commentPub + '/' + id;
    return this.http.post<any>(url, {comment: comment}, {withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }
}
