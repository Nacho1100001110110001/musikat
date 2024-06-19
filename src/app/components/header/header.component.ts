import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(public loginService: LoginService){
  }
}
