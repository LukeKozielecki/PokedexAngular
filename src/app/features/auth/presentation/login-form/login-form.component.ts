import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    RouterLink
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  email = '';
  password = '';
  isLoginMode = true;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}


  onLogin() {
    this.authService.loginUser(this.email, this.password).subscribe({
      next: (userCredential) => {
        console.log('Logged in successfully:', userCredential.user);
        this.router.navigate(['/pokemon']);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error('Login failed:', error.message);
      },
    });
  }

  onRegister() {
    this.authService.registerUser(this.email, this.password).subscribe({
      next: (userCredential) => {
        console.log('Registered successfully:', userCredential.user);
        this.router.navigate(['/pokemon']);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error('Registration failed:', error.message);
      },
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onPasswordReset(event: Event) {
    event.preventDefault();
    if (this.email) {
      this.authService.resetPassword(this.email).subscribe({
        next: () => {
          this.successMessage = $localize`:@@auth.password-reset.success-message:A password reset link has been sent to your email address. Please do check Spam`;
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.successMessage = '';
        },
      });
    } else {
      this.errorMessage = $localize`:@@auth.password-reset.email-required-error:Please enter your email address to reset your password.`;
      this.successMessage = '';
    }
  }
}
