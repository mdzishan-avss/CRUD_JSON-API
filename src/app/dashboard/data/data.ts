import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data.html'
})
export class DataComponent implements OnInit {

  users: any[] = [];

  page = 1;
  limit = 5;

  totalPages = 1;
  totalPagesArray: number[] = [];

  isLoading = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {

    this.isLoading = true;

    const data = this.userService.getUsersCache();
    this.totalPages = Math.ceil(data.length / this.limit);

    this.totalPagesArray = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

    //  IF CACHE EMPTY THEN API CALL
    if (!data || data.length === 0) {

      this.userService.getUsers().subscribe({

        next: (res: any[]) => {

          this.userService.setUsersCache(res);

          const start = (this.page - 1) * this.limit;
          const end = start + this.limit;

          this.users = res.slice(start, end);

          this.isLoading = false;
        },

        error: (err) => {

          console.log(err);

          this.users = [];

          this.isLoading = false;
        }
      });

      return;
    }

    //  CACHE DATA
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    this.users = data.slice(start, end);

    this.isLoading = false;
  }

  nextPage() {
    this.page++;
    this.loadData();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }
  goToPage() {
    this.loadData();
  }
}