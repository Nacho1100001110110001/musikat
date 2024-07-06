import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { enviroments } from '../../enviroments/enviroments';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUserProfile(){
    const url = enviroments.apiConnect.userProfile;
    return this.http.get<any>(url
      , { withCredentials: true}
    ).pipe(map((res: any)=>{
      return res[0];
    }));
  }

  public getUserByName(name: string){
    const url = enviroments.apiConnect.userProfile + "/" + name;
    return this.http.get<any>(url, { withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }

  public updateUser(user: any){
    const url = enviroments.apiConnect.userProfile;
    return this.http.put<any>(url, user, { withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }
}
