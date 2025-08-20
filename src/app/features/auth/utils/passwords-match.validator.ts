import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validator function to check if two password fields match.
 * @param control The FormGroup containing the password and confirm password fields.
 * @returns A ValidationErrors object if passwords do not match, otherwise null.
 */
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    return { passwordsNotMatching: true };
  }
  return null;
}
