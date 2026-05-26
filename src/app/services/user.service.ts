import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.patch(`${this.apiUrl}/${id}`, {
      isActive: status
    });
  }

  // IMPORTANT METHOD
  updateAuthStatus(email: string, status: boolean) {

    return new Observable<any>((observer: any) => {

      this.http.get<any[]>(`${this.AuthUrl}?email=${email}`)
        .subscribe(users => {

          if (users.length > 0) {

            const authUser = users[0];

            this.http.patch(
              `${this.AuthUrl}/${authUser.id}`,
              { isActive: status }
            ).subscribe({

              next: (res) => {
                observer.next(res);
                observer.complete();
              },

              error: (err) => {
                observer.error(err);
              }

            });

          } else {

            observer.next(null);
            observer.complete();
          }
        });
    });
  }

  registerUser(data: any) {
    return this.http.post(this.AuthUrl, data);
  }

  getAuthUsers() {
    return this.http.get<any[]>(this.AuthUrl);
  }

  setUsersCache(data: any[]) {
    this.usersCache = data || [];
  }

  getUsersCache() {
    return this.usersCache || [];
  }
}