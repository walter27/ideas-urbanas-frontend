import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from 'src/app/core/models/token.model';
import { AuthService } from 'src/app/core/services/auth.service';


enum urlInit {
  admin = '/admin/users'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private jwt: JwtHelperService
  ) { }

  ngOnInit() {
    let elem: HTMLElement = document.getElementById('navbarMenu');
    elem.style.setProperty("background-color", '#189cff');
    elem.classList.add("sticky-top");
    elem.classList.remove("fixed-top");
  }

  onSubmit() {
    if ( this.loginForm.valid ) {
      this.authService.login(this.loginForm.value).subscribe( (result: Token) => {
        const token = this.jwt.decodeToken(result.token);
        if ( token.email ) {
          this.authService.setToken(result);
          this.router.navigate(['/auth/force-change-password']);
        } else {
          this.authService.setToken(result);
          const redirectUrl = urlInit.admin;
          this.router.navigate([redirectUrl]);
        }
      }, err => {

      });
    }
  }

}
