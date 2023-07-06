export interface User {
  username: string;
  userRoles: string[];
  jwtToken: string;
  jwtExpiresAt: Date;
}
