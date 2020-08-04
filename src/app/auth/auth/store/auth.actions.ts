import { Action } from '@ngrx/store';

export const SIGNIN = 'SIGNIN';
export const SIGNOUT = 'SIGNOUT';

export class SignIn implements Action {
  readonly type = SIGNIN;

  constructor(public payload: { email: string, userId: string, token: string, expirationDate: Date }) { }
}

export class SignOut implements Action {
  readonly type = SIGNOUT;
}

export type Actions = SignIn | SignOut;
