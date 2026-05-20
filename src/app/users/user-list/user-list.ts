import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html'
})
export class UserList implements OnInit {

  users: any[] = [];

  searchText = '';

  isLoading = false;

  name = '';
  email = '';
  password = '';

  editMode = false;
  selectedId: any = null;

  showForm = false;

  // 🔥 ADDED FOR PAGINATION (NEW)
  page = 1;
  limit = 5;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // =========================
  // LOAD USERS (UPDATED)
  // =========================
  loadUsers(): void {

    this.isLoading = true;

    this.userService.getUsers()
      .subscribe({

        next: (res: any[]) => {

          console.log('USERS:', res);

          // 🔥 SEARCH (SAFE)
          let filtered = this.searchText.trim()
            ? res.filter(user =>
                user.name.toLowerCase().includes(this.searchText.toLowerCase())
              )
            : res;

          // 🔥 PAGINATION LOGIC (NEW)
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

  // =========================
  // SEARCH (UPDATED)
  // =========================
  onSearchChange(): void {

    this.page = 1; // 🔥 RESET PAGE ON SEARCH

    this.loadUsers();
  }

  // =========================
  // PAGINATION (NEW ADDED)
  // =========================
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

  // =========================
  // FORM TOGGLE
  // =========================
  toggleForm(): void {

    this.showForm = !this.showForm;
  }

  // =========================
  // SAVE USER
  // =========================
  saveUser(): void {

    if (!this.name || !this.email || !this.password) {

      alert('All fields required');

      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      isActive: true
    };

    if (this.editMode) {

      this.userService.updateUser(this.selectedId, data)
        .subscribe(() => {

          this.resetForm();

          this.loadUsers();
        });

    } else {

      this.userService.addUser(data)
        .subscribe(() => {

          this.userService.registerUser(data)
            .subscribe(() => {

              this.resetForm();

              this.loadUsers();
            });
        });
    }
  }

  // =========================
  // EDIT USER
  // =========================
  editUser(user: any): void {

    this.showForm = true;

    this.editMode = true;

    this.selectedId = user.id;

    this.name = user.name;

    this.email = user.email;

    this.password = user.password;
  }

  // =========================
  // DELETE USER
  // =========================
  deleteUser(id: any): void {

    if (confirm('Delete User?')) {

      this.userService.deleteUser(id)
        .subscribe(() => {

          this.loadUsers();
        });
    }
  }

  // =========================
  // TOGGLE STATUS
  // =========================
  toggleStatus(user: any): void {

    const updatedStatus = !user.isActive;

    this.userService.updateUserStatus(user.id, updatedStatus)
      .subscribe(() => {

        this.loadUsers();
      });
  }

  // =========================
  // RESET FORM
  // =========================
  resetForm(): void {

    this.name = '';

    this.email = '';

    this.password = '';

    this.editMode = false;

    this.selectedId = null;

    this.showForm = false;
  }
}