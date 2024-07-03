import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user!: any;
  buscadorGrupo: FormGroup;
  showMenu: boolean = false;

  constructor(public loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder){
      this.buscadorGrupo = formBuilder.group({
        buscador:['', Validators.required]
      })
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
    if(this.buscadorGrupo.valid){
      console.log("elpepe")
      let name: string = this.buscadorGrupo.value.buscador;
      name.replace(" ", "%20");
      this.router.navigate(["perfil/"+ name]);
    }
  }

  toggleMenu(){
    this.showMenu = !this.showMenu;
  }

  editarPerfil(){
    this.router.navigate(["editar-perfil"])
  }

  cerrarSesion(){
    this.loginService.logout().subscribe({
      next: (result) => {
        this.router.navigate(["login"]);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }
}
