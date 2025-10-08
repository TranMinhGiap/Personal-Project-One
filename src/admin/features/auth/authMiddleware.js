import Cookies from 'js-cookie';
import { fetchUser } from './authSlice';

export const authMiddleware = (store) => (next) => (action) => {
  // Khi login thành công
  if (action.type === 'auth/setAuth') {
    const token = action.payload.token;
    if (token) {
      Cookies.set('tokenUser', token, { expires: 1, secure: true, sameSite: 'strict' });
    }
  }

  // Khi logout
  if (action.type === 'auth/logout') {
    Cookies.remove('tokenUser');
  }

  // Khi app vừa khởi tạo (redux @@INIT)
  if (action.type === '@@INIT') {
    const token = Cookies.get('tokenUser');
    const { auth } = store.getState();

    // Nếu có token nhưng chưa có user -> tự động fetch user
    if (token && !auth.user) {
      store.dispatch(fetchUser());
    }
  }

  return next(action);
};
