import { env } from '@src/utils/env';

const isLocalhost =
  env.DOMAIN === 'localhost' || env.DOMAIN.endsWith('.localhost');

export const cookieOpts = {
  domain: isLocalhost ? undefined : `.${env.DOMAIN}`,
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 1000, //hour?
};

export const clearCookieOpts = {
  domain: isLocalhost ? undefined : `.${env.DOMAIN}`,
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
  path: '/',
};
