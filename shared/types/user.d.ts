export interface UserDto {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  isAdmin: boolean;
  isCreator: boolean;
  createdAt: Date;
}
