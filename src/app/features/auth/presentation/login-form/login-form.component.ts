import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm implements OnInit{
  email = '';
  password = '';
  isLoginMode = true;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/profile']);
      }
    });
  }

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
}
