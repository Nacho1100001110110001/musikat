import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { RegistroComponent } from './registro/registro.component';

import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent
    
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
  
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
