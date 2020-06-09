import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function ValidatePasswordMatch(group: FormGroup) {
  if ( group.controls.password.value !== group.controls.password_verified.value ) {
      return { validPasswordMatch: true };
  }
  return null;
}
