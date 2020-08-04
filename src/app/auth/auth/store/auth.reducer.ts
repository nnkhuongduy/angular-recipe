import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

export const authReducer = (state: State = initialState, action: AuthActions.Actions) => {
  switch (action.type) {
    case AuthActions.SIGNIN:
      const { email, userId, token, expirationDate } = action.payload;
      const user = new User(email, userId, token, expirationDate);
      return {
        ...state,
        user
      };
    case AuthActions.SIGNOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};
