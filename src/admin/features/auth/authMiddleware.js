import Cookies from 'js-cookie';
import { fetchUser } from './authSlice';

export const authMiddleware = (store) => (next) => (action) => {
  // Khi login thành công
  // console.log(action.payload);
  // console.log(action.type);
  if (action.type === 'auth/setAuth') {
    // console.log("sau khi login !");
    const token = action.payload.token;
    if (token) {
      Cookies.set('tokenAdmin', token, { expires: 1, sameSite: 'strict' });
    }
    store.dispatch(fetchUser());
  }

  // Khi logout
  if (action.type === 'auth/logout') {
    Cookies.remove('tokenAdmin');
  }

  return next(action);
};
