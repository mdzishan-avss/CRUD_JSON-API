import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardLayout {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }



  logout() {

  localStorage.removeItem('isLoggedIn');

  this.router.navigate(['/login']);
}
}