import { Component } from '@angular/core';
import {AuthService} from '../../services/authService';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

//todo: - hook logout ot ui
//  - communicate to the user what is going on, as of now none communication. password needs to be 6+ chars long (stock firebase rule)
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  email = '';
  password = '';
  isLoginMode = true;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.loginUser(this.email, this.password).subscribe({
      next: (userCredential) => {
        console.log('Logged in successfully:', userCredential.user);
        this.router.navigate(['/pokemon']);
      },
      error: (error) => {
        console.error('Login failed:', error.message);
      },
    });
  }

  onRegister() {
    this.authService.registerUser(this.email, this.password).subscribe({
      next: (userCredential) => {
        console.log('Registered successfully:', userCredential.user);
        this.router.navigate(['/pokemon']);
      },
      error: (error) => {
        console.error('Registration failed:', error.message);
      },
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
