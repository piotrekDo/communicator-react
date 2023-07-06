import { AuthRequest, AuthResponse } from '../model/Auth';
import APIclient from './APIclient';

class UserService {
  login(authRequest: AuthRequest) {
    const controller = new AbortController();
    const httpRequest = APIclient.post<AuthResponse>('/login', authRequest);
    return { httpRequest, cancel: () => controller.abort() };
  }
}

export default new UserService();
