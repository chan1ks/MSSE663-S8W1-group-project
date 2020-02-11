import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {UserModel as User} from '../../backend/models/user.models';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  API_URL: string = environment.apiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private httpClient: HttpClient, public router: Router) {
  }

  register(firstName: string, lastName: string, username: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/users/register`, {firstName, lastName, username, password})
      .pipe(map(res => {
          const user = res.user;
          if (res.user && res.token) {
            localStorage.setItem('access_token', res.token);
            this.getUserProfile(res.user._id).subscribe((res) => {
              this.currentUser = res.user;
            });
          }
          return user;
        }),
        catchError(this.handleError)
      );
  }

  login(username: string, password: string) {
    return this.httpClient.post<any>(`${environment.apiUrl}/users/login`, {username, password})
      .pipe(map(res => {
          // login successful if there's a jwt token in the response
          const user = res.user;
          if (res.user && res.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('access_token', res.token);
            this.getUserProfile(res.user._id).subscribe((res) => {
              this.currentUser = res.user;
            });
          }
          return user;
        }),
        catchError(this.handleError)
      );
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  isLoggedIn() {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null);
  }

  logout() {
    return this.httpClient.post<any>(`${this.API_URL}/users/logout`, {}).pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        if (localStorage.removeItem('access_token') == null) {
          this.router.navigate(['login']);
        }
      });
  }

  logoutAll() {
    return this.httpClient.post<any>(`${this.API_URL}/users/logoutAll`, {}).pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        if (localStorage.removeItem('access_token') == null) {
          this.router.navigate(['login']);
        }
      });
  }

  getUserProfile(id): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/users/me`).pipe(
      map((res: Response) => {
        console.log(res);
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      return throwError(errorMessage);
    }
    const errorCode = errorRes.error;
    switch (errorCode) {
      case 'USERNAME_EXISTS':
        errorMessage = 'This username exists already';
        break;
      case 'PASS_TOO_SHORT':
        errorMessage = 'The password must be at least 6 characters long';
        break;
      case 'AUTH_FAIL':
        errorMessage = 'The password or email provided was incorrect';
        break;
    }
    return throwError(errorMessage);
  }
}