import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false
};

export const authReducer = (state: State = initialState, action: AuthActions.Actions) => {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const { email, userId, token, expirationDate } = action.payload;
      const user = new User(email, userId, token, expirationDate);
      return {
        ...state,
        user,
        isLoading: false
      };
    case AuthActions.SIGNOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.SIGNIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        isLoading: true
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        authError: action.payload,
        isLoading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    default:
      return state;
  }
};
