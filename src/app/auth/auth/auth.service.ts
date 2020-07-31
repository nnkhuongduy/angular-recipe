import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

export interface AuthResponeData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  private errorHandler(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this email.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid.';
        break;
    }
    return throwError(errorMessage);
  }

  private authenticationHandler(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponeData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBgk_F-jIMKLvSWqJd7mcZ29P_av29JVm0',
      {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(catchError(this.errorHandler), tap(resData => this.authenticationHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn)));
  }

  signin(email: string, password: string) {
    return this.http.post<AuthResponeData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBgk_F-jIMKLvSWqJd7mcZ29P_av29JVm0',
      {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(catchError(this.errorHandler), tap(resData => this.authenticationHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn)));
  }
}
