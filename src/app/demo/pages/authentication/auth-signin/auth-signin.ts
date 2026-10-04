import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthSignin {

private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}


  register(user: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      user
    );
  }
login(username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      {
        username,
        password
      }
    );
  }


}
