import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardForceChangePasswordService implements CanActivate {

  constructor(
    private authService: AuthService, private router: Router
  ) { }

  canActivate(): boolean {
    if (!this.authService.isAuthenticatedToForceChangePassword()) {
      sessionStorage.clear();
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
