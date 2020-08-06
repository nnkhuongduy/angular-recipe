import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private timer;

  constructor(private store: Store<fromApp.AppState>) { }

  setSignoutTimer(expirationDuration: number) {
    this.timer = setTimeout(() => {
      this.store.dispatch(new AuthActions.SignOut());
    }, expirationDuration);
  }

  clearSignoutTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }
}
