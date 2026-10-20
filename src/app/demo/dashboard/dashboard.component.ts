
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  username = 'Dr. Sample User';
  department = 'Cardiology';

  activeItem = 'Home';
  mobileMenuOpen = false;
  showProfileMenu = false;
  showNotifications = false;

  menuItems: MenuItem[] = [
    { label: 'Home', icon: '⌂' },
    { label: 'New Patient', icon: '♙' },
    { label: 'Patient List', icon: '♧' },
    { label: 'NOAC Assessment', icon: '▤' },
    { label: 'Drug Interactions', icon: '⚕' },
    { label: 'Bleeding Risk', icon: '♥' },
    { label: 'Anticoagulant Switching', icon: '⇄' },
    { label: 'Reports', icon: '▥' },
    { label: 'Settings', icon: '⚙' }
  ];

  constructor(private router: Router) {
    // Load the logged-in doctor's details if available.
    try {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const user = JSON.parse(storedUser);

        this.username =
          user.name ||
          [user.firstName, user.lastName].filter(Boolean).join(' ') ||
          user.username ||
          this.username;

        this.department = user.department || this.department;
      }
    } catch {
      // Keep the default profile if stored data is invalid.
    }
  }

  selectMenu(item: MenuItem): void {
    this.activeItem = item.label;
    this.mobileMenuOpen = false;
    this.showProfileMenu = false;
  }

  selectCard(label: string): void {
    const item = this.menuItems.find(
      menuItem => menuItem.label === label
    );

    if (item) {
      this.selectMenu(item);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username');

    this.router.navigate(['/']);
  }
}
