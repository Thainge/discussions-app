import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { xLg, graphUpArrow, fire, rocket, link45Deg, image, house, activity, globe, bell, bellFill, search, stars, personCircle, eyeFill, arrowBarRight, chatLeft, arrowUpCircle, arrowDownCircle } from 'ngx-bootstrap-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { SettingsComponent } from './settings/settings.component';
import { FooterComponent } from './footer/footer.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthGuardService } from './guards/auth-guard.service';

// Bootstrap icons
const icons = {
  xLg,
  graphUpArrow,
  fire,
  rocket,
  link45Deg,
  image,
  house,
  activity,
  globe,
  bell,
  bellFill,
  search,
  stars,
  personCircle,
  eyeFill,
  arrowBarRight,
  chatLeft,
  arrowUpCircle,
  arrowDownCircle
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    PostComponent,
    SettingsComponent,
    FooterComponent,
    CreatePostComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgxBootstrapIconsModule.pick(icons),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    OAuthModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'create', component: CreatePostComponent, canActivate: [AuthGuardService] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
      { path: 'comments/:postId', component: PostComponent },
      { path: '**', component: HomeComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Hook up frontend 