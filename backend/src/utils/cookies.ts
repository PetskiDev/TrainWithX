export const cookieOpts = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
  maxAge: 15 * 60 * 1000,
};

export const clearCookieOpts = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
  path: '/',
};
