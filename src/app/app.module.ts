import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// rutas


import { AppComponent } from './app.component';

import { APP_ROUTES } from './app.routes';
import { AngularFireModule } from 'angularFire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment.prod';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceModule } from './services/service.module';
import { LoginComponent } from './foreword/login.component';
import { RegisterComponent } from './foreword/register.component';
import { PagesComponent } from './pages/pages.component';
import { SharedModule } from './shared/shared.module';
import { AngularFireAuthModule } from 'angularfire2/auth';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PagesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'Virtual-Office'}),
    APP_ROUTES,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
