import { UserDto } from '@shared/types/user';

export interface AuthResult {
  token: string;
  user: UserDto;
}
