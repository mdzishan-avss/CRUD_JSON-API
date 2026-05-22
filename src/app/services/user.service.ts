import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private AuthUrl = 'http://localhost:3000/auth';
    private apiUrl = 'http://localhost:3000/users';

  private usersCache: any[] = [];

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addUser(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateUser(id: any, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateUserStatus(id: any, status: boolean) {
    return this.http.patch(`${this.apiUrl}/${id}`, { isActive: status });
  }

  registerUser(data: any) {
  return this.http.post(this.AuthUrl, data);
}

getAuthUsers() {
  return this.http.get<any[]>(this.AuthUrl);
}

  //  CACHE SET
  setUsersCache(data: any[]) {
    this.usersCache = data || [];
  }

  //  CACHE GET SAFE
  getUsersCache() {
    return this.usersCache || [];
  }
}