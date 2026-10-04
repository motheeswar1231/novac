// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username = '';
constructor(private router: Router){}
  ngOnInit(): void {

    const userData = localStorage.getItem('user');

    if (userData) {

      const user = JSON.parse(userData);

      this.username =
        user.username ||
        user.firstName ||
        'Doctor';
    }
  }
    logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}
