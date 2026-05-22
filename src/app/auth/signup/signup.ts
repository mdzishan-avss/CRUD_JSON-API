 import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html'
})
export class Register {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) {

    this.registerForm = this.fb.group({

      name: ['', [Validators.required, Validators.minLength(3)]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(4)
      ]]
    });
  }

  submit() {
              this.toastr.success('Registration Successful', "gdxgxdfgh");
              console.log("dsxfsdzfvdgxd")


    if (this.registerForm.invalid) {

      this.toastr.error('Please fill all fields correctly');

      this.registerForm.markAllAsTouched();

      return;
    }

   const data = {
  ...this.registerForm.value,
  isActive: true
};

this.userService.registerUser(data)
  .subscribe({

    next: () => {

      this.userService.addUser(data)
        .subscribe(() => {

          this.toastr.success('Registration Successful');

          this.registerForm.reset();

          this.router.navigate(['/login']);
        });

      this.toastr.success('Registration Successful');

      this.registerForm.reset();

      this.router.navigate(['/login']);

    },

    error: () => {

      this.toastr.error('Registration Failed');
    }
  }); 
  }
}