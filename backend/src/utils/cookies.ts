import { env } from '@src/utils/env.js';

const isLocalhost =
  env.DOMAIN === 'localhost' || env.DOMAIN.endsWith('.localhost');

export const cookieOpts = {
  domain: isLocalhost ? undefined : `.${env.DOMAIN}`,
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 2 * 60 * 60 * 1000, //same as JWT TODO:change to variable
};

export const clearCookieOpts = {
  domain: isLocalhost ? undefined : `.${env.DOMAIN}`,
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/',
};
