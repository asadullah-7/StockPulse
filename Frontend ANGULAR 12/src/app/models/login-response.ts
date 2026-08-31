export interface LoginResponse {
  token: string;
  expiresIn: number;
  roles: string[];
  user: {
    id: string;
    userName: string;
    email: string;
  };
}