import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { HeaderComponent } from './components/header/header.component';
import { FriendsMenuComponent } from './components/friends-menu/friends-menu.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    EditProfileComponent,
    HeaderComponent,
    FriendsMenuComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBootstrapIconsModule.pick(allIcons),
    RouterModule.forRoot([
      {path: 'perfil', component: ProfileComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
