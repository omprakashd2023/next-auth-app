import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  API_AUTH_PREFIX,
  DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN,
  DEFAULT_REDIRECT_PATH_BEFORE_SIGN_IN,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  const { nextUrl } = req;
  const isAuth = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isApiRoute) {
    return null;
  }
  if (isAuthRoute) {
    if (isAuth) {
      return Response.redirect(
        new URL(DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN, nextUrl)
      );
    }

    return null;
  }
  if (!isAuth && !isPublicRoute) {
    return Response.redirect(
      new URL(DEFAULT_REDIRECT_PATH_BEFORE_SIGN_IN, nextUrl)
    );
  }
  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
