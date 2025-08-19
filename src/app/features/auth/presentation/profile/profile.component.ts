import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  imports: [
    MatIcon,
    RouterLink
  ],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class UserProfileComponent implements OnInit{
  userEmail: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

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
}
