import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-list.html'
})
export class UserList implements OnInit {

  userForm!: FormGroup;

  users: any[] = [];

  searchText = '';

  isLoading = true;

  name = '';
  email = '';
  password = '';

  editMode = false;
  selectedId: any = null;

  showForm = false;

  // ADDED FOR PAGINATION 
  page = 1;
  limit = 5;

  totalPages = 1;
  totalPagesArray: number[] = [];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({

      name: ['', [Validators.required, Validators.minLength(3)]],

      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(4)]]

    });
  }



  ngOnInit(): void {
    this.loadUsers();
  }

  openModal() {
    const modal = document.getElementById('userModal');

    if (modal) {
      // @ts-ignore
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  // LOAD USERS (UPDATED)
  loadUsers(): void {

    this.isLoading = true;

    this.userService.getUsers()
      .subscribe({

        next: (res: any[]) => {

          console.log('USERS:', res);

          //  CACHE STORE HERE
          this.userService.setUsersCache(res);

          //  SEARCH
          let filtered = this.searchText.trim()
            ? res.filter(user =>
              user.name.toLowerCase().includes(this.searchText.toLowerCase())
            )
            : res;
            filtered = filtered.reverse();


          this.totalPages = Math.ceil(filtered.length / this.limit);

          this.totalPagesArray = Array.from(
            { length: this.totalPages },
            (_, i) => i + 1
          );

          //  PAGINATION
          const start = (this.page - 1) * this.limit;
          const end = start + this.limit;

          this.users = filtered.slice(start, end);

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.log(err);

          this.users = [];

          this.isLoading = false;

          this.cdr.detectChanges();
        }
      });
  }

  // SEARCH (UPDATED)
  onSearchChange(): void {

    this.page = 1; //  RESET PAGE ON SEARCH

    this.loadUsers();
  }

  // PAGINATION (NEW ADDED)
  nextPage(): void {

    this.page++;

    this.loadUsers();
  }

  prevPage(): void {

    if (this.page > 1) {

      this.page--;

      this.loadUsers();
    }
  }
  // Page dropdown

  goToPage() {
    this.loadUsers();
  }

  // FORM TOGGLE
  toggleForm(): void {

    this.showForm = !this.showForm;
  }

  // SAVE USER
  saveUser(): void {

  if (this.userForm.invalid) {

    this.toastr.warning('Please fill form correctly');

    this.userForm.markAllAsTouched();

    return;
  }

const data = {
  ...this.userForm.value,
  isActive: true
};
  if (this.editMode) {

    this.userService.updateUser(this.selectedId, data)
      .subscribe({
        next: () => {
          this.toastr.info('User Updated');
          this.loadUsers();
          this.resetForm();
        },
        error: () => this.toastr.error('Update Failed')
      });

  } else {

    this.userService.addUser(data)
      .subscribe({
        next: () => {
          this.toastr.success('User Added');
          this.loadUsers();
          this.resetForm();
        },
        error: () => this.toastr.error('Add Failed')
      });
  }
}
    
 // EDIT USER
  editUser(user: any): void {

  this.editMode = true;
  this.selectedId = user.id;

  this.userForm.patchValue({
    name: user.name,  
    email: user.email,
    password: user.password
  });

  const modal = document.getElementById('userModal');

  if (modal) {
    // @ts-ignore
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}


  // DELETE USER
  deleteUser(id: any): void {

    if (confirm('Delete User?')) {

      this.userService.deleteUser(id)
        .subscribe({

          next: () => {

            //  TOAST
            this.toastr.success('User Deleted');

            this.loadUsers();
          },

          error: () => {

            this.toastr.error('Delete Failed');
          }
        });
    }
  }


  // TOGGLE STATUS
toggleStatus(user: any): void {

  const newStatus = !user.isActive;

  // UI update first
  user.isActive = newStatus;

  // USERS collection update
  this.userService.updateUserStatus(user.id, newStatus)
    .subscribe({
      next: () => {

        // AUTH collection update also
        this.userService.updateAuthStatus(
          user.email,
          newStatus
        ).subscribe();

        this.toastr.success('Status Updated');
      },

      error: () => {

        // rollback
        user.isActive = !newStatus;

        this.toastr.error('Status Update Failed');
      }
    });
}

  // RESET FORM

  resetForm(): void {
  this.userForm.reset();
  this.editMode = false;
  this.selectedId = null;
} 
}
