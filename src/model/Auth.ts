export interface AuthRequest {
  username: string;
  userPassword: string;
}

export interface AuthResponse {
  username: string;
  userRoles: string[];
  jwtToken: string;
  jwtExpiresAt: string;
}
