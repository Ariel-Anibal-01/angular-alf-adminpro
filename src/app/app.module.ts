import { BrowserModule } from '@angular/platform-browser';

// Modulos
import { NgModule } from '@angular/core';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';

import { QuillModule } from 'ngx-quill';
import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './auth/auth.module';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';


@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    QuillModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
