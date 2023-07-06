import { create } from 'zustand';
import { User } from '../model/User';
import { AuthResponse } from '../model/Auth';

interface UserState {
  user: User | undefined;
  login: (authRes: AuthResponse) => void;
  setStompUserName: (stompName: string) => void;
}

const useUserState = create<UserState>(set => ({
  user: undefined,
  login: res =>
    set(store => ({
      ...store,
      user: {
        username: res.username,
        userRoles: res.userRoles,
        jwtToken: res.jwtToken,
        jwtExpiresAt: new Date(res.jwtExpiresAt),
      },
    })),
  setStompUserName: name =>
    set(store => ({
      ...store,
      user: store.user ? { ...store.user, stompUsername: name } : undefined,
    })),
}));

export default useUserState;
