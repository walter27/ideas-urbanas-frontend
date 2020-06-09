import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ValidatePasswordMatch } from '../../../shared/validators/passwordMatch.validator';

@Component({
  selector: 'app-force-change-password',
  templateUrl: './force-change-password.component.html',
  styleUrls: ['./force-change-password.component.scss']
})
export class ForceChangePasswordComponent implements OnInit {

  forceChangePasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    password_verified: new FormControl('', [Validators.required])
  }, {
    validators: ValidatePasswordMatch
  });

  titleToast = 'Recuperación de Contraseña';

  constructor(
    private authService: AuthService,
    private router: Router,
    private jwt: JwtHelperService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if ( this.forceChangePasswordForm.valid ) {
      this.authService.forceChangePassword(this.forceChangePasswordForm.value).subscribe( (result) => {
        // this.toastr.success('Contraseña modificada satisfactoriamente', this.titleToast);
        this.router.navigate(['/auth/login']);
      }, err => {
        // this.toastr.error(err.error.message, this.titleToast);
      });
    }
  }

  get password_verified() {
    return this.forceChangePasswordForm.get('password_verified');
  }
}
