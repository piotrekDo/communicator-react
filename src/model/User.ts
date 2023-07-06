export interface User {
  username: string;
  stompUsername?: string;
  userRoles: string[];
  jwtToken: string;
  jwtExpiresAt: Date;
}
