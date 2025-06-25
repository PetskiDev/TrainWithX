export interface LoginResponse {
  token: string;
  userId: number;
  username: string; // <-- add this
}
