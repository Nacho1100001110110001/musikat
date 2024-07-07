import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { loginGuard } from './guard/login.guard';
import { FeedComponent } from './pages/feed/feed.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'editar-perfil', component: EditProfileComponent, canActivate: [loginGuard] },
  { path: 'perfil', component: ProfileComponent, canActivate: [loginGuard] },
  {path: 'inicio', component: FeedComponent, canActivate: [loginGuard]}, //Ruta para el feed
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirigir al login por defecto
  { path: 'perfil/:nombre', component: ProfileComponent, 
    canActivate: [loginGuard] 
  },
  { path: '**', redirectTo: '/login' }, // Redirigir a login en caso de una ruta no encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
