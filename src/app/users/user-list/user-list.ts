import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  searchText: string = '';
  name = '';
  email = '';
  password = '';
  editMode = false;
  selectedId: number = 0;
  showForm = false;
  page: number = 1;
  limit: number = 5;

  // Naya Variable: Buffering control karne ke liye
  isLoading: boolean = false;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    console.log('user list loaded')
    this.loadUsers();
  }

  get filteredUsers() {

    if (!Array.isArray(this.users)) {
      return [];
    }

    const search = this.searchText?.toLowerCase().trim();

    if (!search) {
      return this.users;
    }

    return this.users.filter((user: any) =>
      (user.name || '').toLowerCase().includes(search) ||
      (user.email || '').toLowerCase().includes(search)
    );
  }

  loadUsers() {
    this.isLoading = true;

    this.userService.getUsers(this.page, this.limit).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.users = res;
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error(err);
        this.users = [];
        this.isLoading = false;
      }
    });

  }
  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  saveUser() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    if (this.editMode) {
      this.userService.updateUser(this.selectedId, user).subscribe({
        next: () => {
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.userService.addUser(user).subscribe({
        next: (res) => {
          console.log("Saved:", res);
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => {
          console.error("Save failed", err);
        }
      });
    }
  }
  nextPage() {
    this.page++;
    this.loadUsers();
  }
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }
  toggleStatus(user: any) {
    const updatedStatus = !user.isActive; // Toggle current status

    this.userService.updateUserStatus(user.id, updatedStatus).subscribe({
      next: () => {
        user.isActive = updatedStatus; // UI update
        console.log(`User ${user.name} is now ${user.isActive ? 'Active' : 'Inactive'}`);
      },
      error: (err) => {
        console.error("Status update failed", err);
        alert("Unable to change the status!");
      }
    });
  }
  editUser(user: any) {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }

  deleteUser(id: number) {
    if (confirm("Are you sure?")) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  resetForm() {
    this.name = ''; this.email = ''; this.password = '';
    this.editMode = false; this.showForm = false;
  }

}