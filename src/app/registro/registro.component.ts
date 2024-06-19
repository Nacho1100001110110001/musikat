import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passworddos: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Lógica para el envío del formulario
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
