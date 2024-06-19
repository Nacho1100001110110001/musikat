import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { enviroments } from '../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})


export class LoginService {

  public logeado: boolean=false;

  constructor(private http: HttpClient, private router: Router) { }

  public login (email: any, password: any){
    let userLogin= {email: email, password: password};
    const url = enviroments.apiConnect.login;
    return this.http.post<any>(url, userLogin, {observe: "response", withCredentials: true})
    .pipe(map((res: HttpResponse<any>)=>{
      this.logeado = true;
      console.log(res);
      this.router.navigate(['perfil']);
      return res;
    }));
  }

  public logout () {
    const url = enviroments.apiConnect.logout;
    return this.http.post<any>(url, null).pipe(map((res: any)=>{
      this.logeado = false;
      this.router.navigate(['login']);
      return res;
    }));
  }

  public logged () {
    const url = enviroments.apiConnect.logged;
    return this.http.get<any>(url, {observe: "response", withCredentials: true}).pipe();
  }

  public register (user: any){
    const url = enviroments.apiConnect.register;
    return this.http.post<any>(url, user).pipe(map((res: any)=>{
      alert("Usuario creado con exito");
      this.router.navigate(['login']);
      return res;
    }));
  }
}
