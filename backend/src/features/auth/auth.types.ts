import { UserDto } from '@trainwithx/shared';

export interface AuthResult {
  token: string;
  user: UserDto;
}
