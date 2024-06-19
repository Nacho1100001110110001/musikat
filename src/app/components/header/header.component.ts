import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user!: any;
  buscador: FormControl;

  constructor(public loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder){
      this.buscador = formBuilder.control("buscador", Validators.required);
  }

  ngOnInit(){
    this.getUser();
  }

  getUser(){
    this.userService.getUserProfile().subscribe({
      next: (result) => {
        this.user = result;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  search(){
    if(this.buscador.valid){
      let name: string = this.buscador.value;
      name.replace(" ", "%20");
      this.router.navigateByUrl("/profile/"+ name);
    }
  }
}
