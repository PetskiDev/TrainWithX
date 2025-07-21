import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';
import type { UserDto } from '@shared/types/user';


export function goToDashboard(user: UserDto) {
  const { goPublic } = useSmartNavigate();

  if (user.isAdmin) {
    goPublic('/admin');
  } else if (user.isCreator) {
    goPublic('/me/creator');
  } else {
    goPublic('/me');
  }
}
