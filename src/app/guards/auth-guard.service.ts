import { AuthenticationService } from './../authentication.service';
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private googleAuth: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isLoggedIn = this.googleAuth.isLoggedIn();
    if (isLoggedIn) {
      return true;
    }
    this.googleAuth.login();
    return false;
  }
}