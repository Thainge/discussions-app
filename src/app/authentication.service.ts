import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '255578402529-m3134s7hraulm0lbv7vvcg3lv4aqhjrg.apps.googleusercontent.com',
  scope: 'openid profile email',
};

export interface UserInfo {
  info: {
    sub: string,
    email: string,
    given_name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public userProfile = new Subject<UserInfo>();
  public userData?: UserInfo;

  constructor(private oAuthService: OAuthService, private router: Router) {
    let foundUser = this.getUser();

    if (!foundUser.info) {
      setTimeout(() => {
        this.userData = this.getUser();
      }, 500)
    }
    this.userData = foundUser;

    oAuthService.configure(oAuthConfig);
    oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if (!oAuthService.hasValidAccessToken()) {
          // Do nothing
        } else {
          // Existing login session, get user data
          this.oAuthService.loadUserProfile().then((userProfile) => {
            let userData = userProfile as UserInfo;
            this.userData = userData;
            this.userProfile.next(userData);
            localStorage.setItem('userData', JSON.stringify(userProfile));
          });
        }
      });
    });
  }

  public getUser() {
    return JSON.parse(localStorage.getItem('userData') || '{}') as UserInfo;
  }

  login() {
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          // Existing login session, get user data
          this.oAuthService.loadUserProfile().then((userProfile) => {
            let userData = userProfile as UserInfo;
            this.userData = userData;
            this.userProfile.next(userData);
            localStorage.setItem('userData', JSON.stringify(userProfile));
          });
        }
      })
    })
  }

  isLoggedIn(): boolean {
    if (this.userData?.info) {
      return true;
    } else {
      return false;
    }
  }

  signOut() {
    localStorage.removeItem("userData");
    this.userData = undefined;
    this.oAuthService.logOut();
    this.router
      .navigate(["/"])
      .then(() => {
        window.location.reload();
      });
  }
}
