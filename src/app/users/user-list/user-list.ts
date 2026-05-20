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

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.loadUsers();
    });
  }

  // LOAD USERS
  loadUsers(): void {

    this.isLoading = true;

    this.userService.getUsers()
      .subscribe({

        next: (res: any[]) => {

          console.log('USERS:', res);

          // 🔥 FRONTEND SEARCH
          if (this.searchText.trim()) {

            this.users = res.filter(user =>

              user.name.toLowerCase()
                .includes(this.searchText.toLowerCase())

            );

          }

          else {

            this.users = res;
          }

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

  // SEARCH
  onSearchChange(): void {

    this.loadUsers();
  }

  // SHOW FORM
  toggleForm(): void {

    this.showForm = !this.showForm;
  }

  // SAVE USER
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

    // EDIT
    if (this.editMode) {

      this.userService.updateUser(this.selectedId, data)
        .subscribe(() => {

          this.resetForm();

          this.loadUsers();
        });

    }

    // ADD
    else {

      this.userService.addUser(data)
        .subscribe(() => {

          // ALSO SAVE FOR LOGIN
          this.userService.registerUser(data)
            .subscribe(() => {

              this.resetForm();

              this.loadUsers();
            });
        });
    }
  }

  // EDIT USER
  editUser(user: any): void {

    this.showForm = true;

    this.editMode = true;

    this.selectedId = user.id;

    this.name = user.name;

    this.email = user.email;

    this.password = user.password;
  }

  // DELETE USER
  deleteUser(id: any): void {

    if (confirm('Delete User?')) {

      this.userService.deleteUser(id)
        .subscribe(() => {

          this.loadUsers();
        });
    }
  }

  // TOGGLE STATUS
  toggleStatus(user: any): void {

    const updatedStatus = !user.isActive;

    this.userService.updateUserStatus(user.id, updatedStatus)
      .subscribe({
        next: () => {

          // 🔥 instant UI update
          this.users = this.users.map(u =>
            u.id === user.id
              ? { ...u, isActive: updatedStatus }
              : u
          );
        },

        error: (err) => {
          console.log(err);
        }
      });
  }

  // RESET FORM
  resetForm(): void {

    this.name = '';

    this.email = '';

    this.password = '';

    this.editMode = false;

    this.selectedId = null;

    this.showForm = false;
  }
}