export interface UserDto {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  isVerified: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  createdAt: Date;
  isActive: boolean;
}
