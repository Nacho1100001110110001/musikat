import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderComponent } from './components/header/header.component';
import { FriendsMenuComponent } from './components/friends-menu/friends-menu.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { FeedComponent } from './pages/feed/feed.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
    LoginComponent,
    RegistroComponent,
    EditProfileComponent,
    HeaderComponent,
    FriendsMenuComponent,
    ProfileComponent,
    FeedComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent},
      {path: '', redirectTo:'login', pathMatch:'full'},
    ]),
    AppRoutingModule,
    NgxBootstrapIconsModule.pick(allIcons),
    RouterModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
