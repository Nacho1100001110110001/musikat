import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../enviroments/enviroments';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http: HttpClient) {
  }

  getSongById(id: number){
    const url = enviroments.musicApiConnet.getSongById + "/" + id;
    return this.http.get<any>(url).pipe(map((res: any)=>{
      return res;
    }));
  }

  searchSongs(query: string){
    const url = enviroments.musicApiConnet.searchSongs + '/?q="' + query + "'";
    return this.http.get<any>(url).pipe(map((res: any)=>{
      return res;
    }));
  }

}
