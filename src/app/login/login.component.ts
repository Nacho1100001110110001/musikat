import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login/login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formLogin: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService:LoginService){
    this.formLogin= this.formBuilder.group({
      email:['',[Validators.required]],
      password: ['',[Validators.required]]
    });
  }
  
  login(){
    console.log(this.formLogin.value.email);
    console.log(this.formLogin.value.password);

    this.loginService.login(this.formLogin.value.email, this.formLogin.value.password)
      .subscribe((res: any[])=>{
        console.log(res),
        (err: HttpErrorResponse) => {  // Especifica el tipo aquí
          console.log(err);
        }
      });
  }



}
