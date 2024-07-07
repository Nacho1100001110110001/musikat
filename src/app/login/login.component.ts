import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login/login.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formLogin: FormGroup;
  title= 'Login'
  passwordVisible: { [key: string]: boolean } = {
    password: false,
    passworddos: false
  };

  constructor(private formBuilder: FormBuilder, private loginService:LoginService, private router: Router){
    this.formLogin= this.formBuilder.group({
      email:['',[Validators.required]],
      password: ['',[Validators.required]]
    });
  }

  ngOnInit(){
    this.loginService.logged().subscribe({
      next: (result) => {
        this.router.navigate(['inicio']);
      },
      error: (error) => {
      },
      complete: () => {},
    });
  }
  
  login(){
    if(!this.formLogin.valid) alert("Rellena los campos");
    console.log(this.formLogin.get('email')?.value);
    console.log(this.formLogin.get('password')?.value);

    this.loginService.login(this.formLogin.value.email, this.formLogin.value.password)
      .subscribe((res: HttpResponse<any>)=>{
        console.log(res.headers.keys()),
        (err: HttpErrorResponse) => {  // Especifica el tipo aquí
          console.log(err);
        }
      });
  }

  togglePasswordVisibility(field: string) {
    this.passwordVisible[field] = !this.passwordVisible[field];
    const input = document.getElementById(field) as HTMLInputElement;
    if (this.passwordVisible[field]) {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  }



}
