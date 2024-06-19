import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class LoginService {

  public logeado: boolean=false;

  constructor(private hhtp: HttpClient) { }

  public login (email: any, password: any){
    let userLogin= {email: email, password: password};
    return this.hhtp.post<any>('http://localhost:3000/login', userLogin).pipe(map((res: any)=>{
      localStorage.setItem('token', res.token);
      localStorage.setItem('usuario',JSON.stringify(res.usuario));
      return res;
    }));
  }

}
