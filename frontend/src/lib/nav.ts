import type { UserDto } from '@shared/types/user';

export function goToCreator({
  subdomain,
  path = '/',
}: {
  subdomain: string;
  path?: string;
}) {
  const { protocol } = window.location;
  const base = import.meta.env.VITE_BASE_DOMAIN!;

  const url = `${protocol}//${subdomain}.${base}${path}`;
  window.location.assign(url);
}

export const goPublic = (path: string = '/'): void => {
  const { protocol } = window.location;
  const base = import.meta.env.VITE_BASE_DOMAIN!;
  const url = `${protocol}//${base}${path}`;
  console.log('Redirecting to', `${url}`);

  window.location.assign(url);
};

export function goToDashboard(user: UserDto) {
  if (user.isAdmin) {
    goPublic('/admin');
  } else if (user.isCreator) {
    goPublic('/me/creator');
  } else {
    goPublic('/me');
  }
}
