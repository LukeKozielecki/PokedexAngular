import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {passwordsMatchValidator} from '../../utils/passwords-match.validator';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [
    MatIcon,
    RouterLink,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class UserProfileComponent implements OnInit{
  userEmail: string | null = null;
  showUpdatePassword = false;
  passwordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator });
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userEmail = user.email;
      }
    });
  }

  onLogout() {
    this.authService.logoutUser().subscribe({
      next: () => {
        console.log('Logged out successfully');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error.message);
      }
    });
  }

  onToggleUpdatePassword() {
    this.showUpdatePassword = !this.showUpdatePassword;
  }

  onUpdatePassword() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.value.newPassword;
      this.authService.updatePassword(newPassword).subscribe({
        next: () => {
          console.log('Password has been updated!');
          this.showUpdatePassword = false;
          this.passwordForm.reset();
        },
        error: (err) => {
          console.error('Password update failed:', err);
        }
      });
    }
  }
}
