export const cookieOpts = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 1000, //hour?
};

export const clearCookieOpts = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
  path: '/',
};
