import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MetingModule } from './meting/meting.module';
import { MaterialModule } from './material/material.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModule } from './user/user.module';
import { httpInterceptorProviders } from './interceptors';
<<<<<<< HEAD
import { MatSliderModule } from '@angular/material/slider';
=======
import {MatSliderModule} from '@angular/material/slider';
>>>>>>> metslider

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, MainNavComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MetingModule,
    MaterialModule,
    HttpClientModule,
    UserModule,
    AppRoutingModule,
<<<<<<< HEAD
    MatSliderModule,
=======
    MatSliderModule
>>>>>>> metslider
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
