import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  
  
login() {
  console.log('login clicked');

  this.auth.login(this.email, this.password)
    .subscribe({
      next: (res: any) => {

        if (res && res.length > 0) {

          const user = res[0];

          if (user.isActive === false) {
            alert("Account inactive");
            return;
          }

          localStorage.setItem('user', JSON.stringify(user));

          this.router.navigate(['/dashboard/users']);

        } else {
          alert('Invalid Credentials ❌');
        }

      },
      error: (err) => {
        console.error(err);
        alert('Server Error');
      }
    });
}
  }
  
