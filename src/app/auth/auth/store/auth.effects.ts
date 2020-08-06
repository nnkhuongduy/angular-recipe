import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

interface UserInterface {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

export interface AuthResponeData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const authenticationHandler = (email: string, userId: string, token: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({ email, userId, token, expirationDate, redirect: true });
};

const errorHandler = (errorRes: HttpErrorResponse) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  constructor(
    private action$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) { }

  @Effect() authLogin = this.action$.pipe(ofType(AuthActions.SIGNIN_START), switchMap((authData: AuthActions.SignInStart) => {
    return this.http.post<AuthResponeData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(tap(resData => {
        this.authService.setSignoutTimer(+resData.expiresIn * 1000);
      }), map(resData => {
        return authenticationHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }), catchError((errorRes: HttpErrorResponse) => {
        return errorHandler(errorRes);
      }));
  }));

  @Effect({ dispatch: false }) authRedirect = this.action$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap((authAction: AuthActions.AuthenticateSuccess) => {
    this.authService.clearSignoutTimer();
    if (authAction.payload.redirect) {
      this.router.navigate(['/']);
    }
  }));

  @Effect() authSignup = this.action$.pipe(ofType(AuthActions.SIGNUP_START), switchMap((authData: AuthActions.SignUpStart) => {
    return this.http.post<AuthResponeData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(map(resData => {
        this.authService.setSignoutTimer(+resData.expiresIn * 1000);
        return authenticationHandler(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }), catchError((errorRes: HttpErrorResponse) => {
        return errorHandler(errorRes);
      }));
  }));

  @Effect({ dispatch: false }) authSignout = this.action$.pipe(ofType(AuthActions.SIGNOUT), tap(() => {
    this.authService.clearSignoutTimer();
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
  }));

  @Effect() authAuto = this.action$.pipe(ofType(AuthActions.AUTO_SIGNIN), map(() => {
    const userData: UserInterface = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return { type: 'DUMMY' };
    }

    const loadedUser: User = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      const expirationDuration: number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.authService.setSignoutTimer(expirationDuration * 1000);
      return new AuthActions.AuthenticateSuccess({ email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate), redirect: false });
    } else {
      return { type: 'DUMMY' };
    }
  }));

}
