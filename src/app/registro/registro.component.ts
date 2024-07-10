import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  registerForm: FormGroup;
  title= 'Registro'
  passwordVisible: { [key: string]: boolean } = {
    password: false,
    passworddos: false
  };

  constructor(private fb: FormBuilder, private loginService: LoginService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      password: ['', Validators.required],
      passworddos: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if(this.registerForm.value.password != this.registerForm.value.passworddos){
        return;
      }
      let user = {email: this.registerForm.value.email, username: this.registerForm.value.username, password: this.registerForm.value.password};
      this.loginService.register(user).subscribe();
    }else{
      alert("Debes completar todos los campos")
    }
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
