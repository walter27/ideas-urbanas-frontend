import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required])
  });

  titleToast = 'Recuperación de Contraseña';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if ( this.forgotPasswordForm.valid ) {
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe( result => {
        this.router.navigate(['/auth/login']);
      }, err => {
      });
    }
  }

}
