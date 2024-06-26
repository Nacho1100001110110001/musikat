import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { loginGuard } from './guard/login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'editar-perfil', component: EditProfileComponent, canActivate: [loginGuard] },
  { path: 'perfil', component: ProfileComponent, canActivate: [loginGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirigir al login por defecto
  { path: '**', redirectTo: '/login' }, // Redirigir a login en caso de una ruta no encontrada
  { path: 'perfil/:nombre', component: ProfileComponent, canActivate: [loginGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
