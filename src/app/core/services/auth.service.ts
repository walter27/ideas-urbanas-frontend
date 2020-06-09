import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from 'src/app/core/models/token.model';
import { Observable } from 'rxjs';
import { ResponseApi } from '../models/responseApi.model';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User } from '../models/user.model';


/*
  Este servicio se inyecta en la raiz del proyecto porque estará disponible en todos los módulos
  Siempre que se vaya a crear un servicio se debe verificar la mejor forma de Inyectarlo
*/

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  serverUrl = environment.serverUrl;
  urlLogin = environment.auth.login;
  urlForgotPassword = environment.auth.forgotPassword;
  urlforceChangePassword = environment.auth.forceChangePassword;
  urlBase = environment.auth.base;
  stage = environment.stage;

  constructor(
    private httpClient: HttpClient,
    private jwtHelperService: JwtHelperService,
    private router: Router
  ) { }

  login(profile): Observable<Token> {
    return this.httpClient.post<ResponseApi<Token>>(this.serverUrl + this.urlBase + this.urlLogin, profile, httpOptions).pipe(
      map( data => {
        return data.results;
      })
    );
  }

  forgotPassword(profile): Observable<User> {
    return this.httpClient.post<ResponseApi<User>>(this.serverUrl + this.urlBase + this.urlForgotPassword, profile, httpOptions).pipe(
      map( data => {
        return data.results;
      })
    );
  }

  forceChangePassword(profile): Observable<User> {
    return this.httpClient.post<ResponseApi<User>>(this.serverUrl + this.urlBase + this.urlforceChangePassword,
      { password: profile.password }, httpOptions).pipe(
      map( data => {
        return data.results;
      })
    );
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/auth']);
  }

  getName() {
    return this.jwtHelperService.decodeToken(this.getToken()).user.name;
  }

  getRole() {
    return this.jwtHelperService.decodeToken(this.getToken()).user.role;
  }

  setToken(token: Token) {
    sessionStorage.setItem('token', token.token);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  clearToken() {
    sessionStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.jwtHelperService.tokenGetter();
    if ( !token ) {
      return false;
    }
    try {
      const decodeToken = this.jwtHelperService.decodeToken(token);
      if ( !decodeToken.user.email ) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  isAuthenticatedToForceChangePassword(): boolean {
    const token = this.jwtHelperService.tokenGetter();
    if ( !token ) {
      return false;
    }
    try {
      const decodeToken = this.jwtHelperService.decodeToken(token);
      if ( !decodeToken.email ) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}
