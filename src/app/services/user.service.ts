import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:3000/users';
  authUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  // GET USERS
  getUsers() {

  return this.http.get<any[]>(this.apiUrl);
}

  // ADD USER
  addUser(user: any) {
    return this.http.post(this.apiUrl, user);
  }

  // SAVE FOR LOGIN
  registerUser(user: any) {
    return this.http.post(this.authUrl, user);
  }

  // UPDATE USER
  updateUser(id: any, user: any) {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // DELETE USER
  deleteUser(id: any) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // TOGGLE STATUS
  updateUserStatus(id: any, status: boolean) {
    return this.http.patch(`${this.apiUrl}/${id}`, {
      isActive: status
    });
  }
}