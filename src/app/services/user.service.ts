import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:4000/users';

  constructor(private http: HttpClient) { }


  getUsers(page: number, limit: number) {

    // console.log("URL HIT:",
    //   `${this.apiUrl}?_page=${page}&_limit=${limit}`
    // );

    return this.http.get<any[]>(
      `${this.apiUrl}`
    );
  }
  // Add User
  addUser(user: any) {
    return this.http.post(this.apiUrl, user);
  }

  // Update User
  updateUser(id: number, user: any) {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // Delete User
  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // user.service.ts
  updateUserStatus(id: number, status: boolean) {

    return this.http.patch(`${this.apiUrl}/${id}`, { isActive: status });
  }


}