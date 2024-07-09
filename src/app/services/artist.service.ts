import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroments } from '../../enviroments/enviroments';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  
  constructor(private http: HttpClient) { }

  getArtistById(id: number){
    const url = enviroments.musicApiConnet.getArtistById + "/" + id;
    return this.http.get<any>(url).pipe(map((res: any)=>{
      return res;
    }));
  }

  searchArtist(query: string){
    const url = enviroments.musicApiConnet.searchArtists + '/?q="' + query + "'";
    return this.http.get<any>(url).pipe(map((res: any)=>{
      return res;
    }));
  }

  getTopSongs(id: number){
    const url = enviroments.musicApiConnet.getArtistById + '/' + id + "/top?limit=5";
    return this.http.get<any>(url).pipe(map((res: any)=>{
      return res.data;
    }));
    
  }

  get50Songs(id: number){
    const url = enviroments.musicApiConnet.getArtistById + '/' + id + "/top?limit=50";
    return this.http.get<any>(url).pipe(map((res: any)=>{
      return res.data;
    }));
  }

  likeArtist(id: number){
    const url = enviroments.apiConnect.likeArtist + '/' + id;
    return this.http.put<any>(url, {id: id}, {withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }
}
