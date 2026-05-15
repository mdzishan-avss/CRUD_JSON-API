import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

    constructor(private userservice: UserService) {}
  // protected readonly title = signal('API');

  users: any[] = [];

page: number = 1;
limit: number = 5;

loadUsers() {
  this.userservice.getUsers(this.page, this.limit)
    .subscribe((res: any) => {
      this.users = res;
    });
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


}
