import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  logged: boolean = false;

  constructor(private loginService: LoginService){
    this.logged = this.loginService.logeado;
  }

  ngOnInit(){
    this.logged = this.loginService.logeado;
    console.log(this.loginService.logeado)
  }
}
