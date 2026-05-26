import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {

  return this.http.get(
    `${this.apiUrl}?email=${email}&password=${password}&isActive=true`
  );

}

  register(user: any) {

    return this.http.post(this.apiUrl, user);
  }
}