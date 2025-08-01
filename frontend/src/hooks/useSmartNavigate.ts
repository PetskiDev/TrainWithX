import type { UserDto } from '@trainwithx/shared';
import { useNavigate } from 'react-router-dom';

export const useSmartNavigate = () => {
  const navigate = useNavigate();
  const base = import.meta.env.VITE_BASE_DOMAIN!;
  const currentHost = window.location.host;

  const goPublic = (path: string = '/', newTab: boolean = false) => {
    const targetHost = base;
    const isSameHost = currentHost === targetHost;
    const url = `${window.location.protocol}//${targetHost}${path}`;
    if (newTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (isSameHost) {
      navigate(path);
    } else {
      window.location.assign(url);
    }
  };

  const goToCreator = ({
    subdomain,
    path = '/',
    newTab = false,
  }: {
    subdomain: string;
    path?: string;
    newTab?: boolean;
  }) => {
    const targetHost = `${subdomain}.${base}`;
    const isSameHost = currentHost === targetHost;
    const url = `${window.location.protocol}//${targetHost}${path}`;

    if (newTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (isSameHost) {
      navigate(path);
    } else {
      window.location.assign(url);
    }
  };
  const goToDashboard = (user: UserDto) => {
    if (user.isAdmin) {
      goPublic('/admin');
    } else if (user.isCreator) {
      goPublic('/me/creator');
    } else {
      goPublic('/me');
    }
  };

  return { goPublic, goToCreator, goToDashboard };
};
