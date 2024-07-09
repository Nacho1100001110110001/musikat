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
      return res;
    }));
  }

  public getUserByName(name: string){
    const url = enviroments.apiConnect.userProfile + "/" + name;
    return this.http.get<any>(url, { withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }

  public searchUser(name: string){
    const url = enviroments.apiConnect.searchUser + "/" + name;
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

  public getPhoto(id: number){
    const url = enviroments.apiConnect.photo + "/" + id;
    return this.http.get(url, { responseType: 'blob' }).pipe(map((res: any)=>{
      return res;
    }));
  }

  public setPhoto(photo: File){
    const url = enviroments.apiConnect.photo;
    const form: FormData = new FormData();
    form.append('imagen', photo);
    return this.http.post<any>(url, form, { withCredentials: true}).pipe(map((res: any)=>{
      return res;
    }));
  }

  public getPreferences(){
    const url = enviroments.apiConnect.preferences;
    return this.http.get(url, { withCredentials: true }).pipe(map((res: any)=>{
      return res;
    }));
  }
}
