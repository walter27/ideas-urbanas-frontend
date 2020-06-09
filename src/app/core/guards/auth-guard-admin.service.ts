import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService, private router: Router
  ) { }

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      sessionStorage.clear();
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }

  canActivateChild(): boolean {
    if (!this.authService.isAuthenticated()) {
      sessionStorage.clear();
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
