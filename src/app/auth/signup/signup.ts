import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html'
})
export class Register {

  name = '';
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {

    console.log('signup clicked');

    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    console.log(user);

    this.auth.register(user).subscribe({

      next: (res) => {

        console.log('saved', res);

        alert('Signup Successful');

        this.router.navigate(['/login']);
      },

      error: (err) => {

        console.log(err);

      }
    });
  }
}