import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/authService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
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
