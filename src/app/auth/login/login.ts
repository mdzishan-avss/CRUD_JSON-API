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
  ) { }



  login() {
    console.log('login clicked');

    this.auth.login(this.email, this.password)
      .subscribe({
        next: (res: any) => {

          console.log("LOGIN RESPONSE:", res);

          //  SAFE CHECK
          if (!res || !Array.isArray(res) || res.length === 0) {
            alert('Invalid Credentials ');
            return;
          }

          const user = res[0];

          //  INACTIVE USER BLOCK
          if (user.isActive === false) {
            alert("Account inactive ");
            return;
          }

          //  SUCCESS LOGIN
          localStorage.setItem('user', JSON.stringify(user));

          localStorage.setItem('isLoggedIn', 'true');

          this.router.navigate(['/dashboard/users']);
        },

        error: (err) => {
          console.error(err);
          alert('Server Error');
        }
      });
  }
}

