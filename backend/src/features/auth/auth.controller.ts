import { Request, Response } from "express";
import {
  getUserInfoFromGoogle,
  login,
  register,
  getOrCreateGoogleUser,
  verifyEmail,
  createAndSendVerificationToken,
} from "./auth.service.js";
import { AppError } from "@src/utils/AppError.js";
import { clearCookieOpts, cookieOpts } from "@src/utils/cookies.js";
import querystring from "node:querystring";
import { env } from "@src/utils/env.js";
import { registerSchema } from "@trainwithx/shared";
import { treeifyError } from "zod";

export async function registerController(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors = treeifyError(parsed.error);
    throw new AppError("Validation failed", 400, errors);
  }

  const { email, username, password } = parsed.data;
  if (!email || !username || !password) {
    throw new AppError("Email, username, and password are required.", 400);
  }

  const result = await register(email, username, password);

  if (result.user.isVerified) {
    // It was an already-registered Google account
    res
      .cookie("access", result.token, cookieOpts)
      .status(201)
      .json(result.user);
  } else {
    res.status(200).json(result.user);
    // Account created, but email not verified — no cookie yet
  }
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Email, and password are required.", 400);
  }
  const result = await login(email, password);

  if (!result.user.isVerified) {
    // Don't set cookie, just return info for frontend to act
    await createAndSendVerificationToken({
      userId: result.user.id,
      email: result.user.email,
      username: result.user.username,
    });
    res.status(401).json({
      message: "Email not verified.",
      reason: "not_verified",
    });
    return;
  }

  res.cookie("access", result.token, cookieOpts).status(200).json(result.user);
}

export async function logoutController(req: Request, res: Response) {
  res.clearCookie("access", clearCookieOpts);
  res.status(200).json({ message: "Logged out" });
}

export async function verifyController(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) throw new AppError("Token required", 400);

  await verifyEmail(token);

  res.json({
    ok: true,
    message: "Email successfully verified.",
  });
}

export async function redirectToGoogleController(req: Request, res: Response) {
  const qs = querystring.stringify({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${env.API_URL}/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${qs}`);
}

function isSafeRedirect(urlStr: string | undefined): boolean {
  if (!urlStr) return false;
  console.log("URL STR:" + urlStr);
  try {
    const url = new URL(urlStr);
    const hostname = url.hostname;
    console.log("HOSTNAME:" + hostname);

    // Allow main domain and any subdomain of it
    return hostname === env.DOMAIN || hostname.endsWith(`.${env.DOMAIN}`);
  } catch {
    return false;
  }
}

export async function googleCallbackController(req: Request, res: Response) {
  //get the auth code
  const code = req.query.code as string | undefined;
  if (!code) throw new AppError("Missing OAuth code", 400);

  //use the code to ask google for the user
  const { googleId, email, name, picture } = await getUserInfoFromGoogle(code);

  const redirectUrl = req.cookies.redirectUrl;
  res.clearCookie("redirectUrl", { path: "/", domain: `.${env.DOMAIN}` });

  const finalRedirect = isSafeRedirect(redirectUrl)
    ? redirectUrl!
    : `${env.FRONTEND_URL}/auth-redirect`;

  const result = await getOrCreateGoogleUser({
    googleId,
    email,
    name,
    picture,
  });

  res.cookie("access", result.token, cookieOpts).redirect(finalRedirect);
}
