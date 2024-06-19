import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'editar-perfil', component: EditProfileComponent },
  {path: 'perfil', component: ProfileComponent},
  {path: '**', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
