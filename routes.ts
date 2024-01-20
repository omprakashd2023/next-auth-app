/**
 * An array of routes that can be accessed publicly.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/verify-email"];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect the logged in users to "/".
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/sign-in",
  "/sign-up",
  "/reset-password",
  "/new-password",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const API_AUTH_PREFIX: string = "/api/auth";

/**
 * This is the default redirect path for the users who has logged-in.
 * @type {string}
 */
export const DEFAULT_REDIRECT_PATH_AFTER_SIGN_IN: string = "/";

/**
 * This is the default redirect path for the users who has not logged-in and trying to access the protected routes.
 * @type {string}
 */
export const DEFAULT_REDIRECT_PATH_BEFORE_SIGN_IN: string = "/sign-in";

/**
 * This is the default redirect path after the email verification process.
 * @type {string}
 */
export const DEFAULT_REDIRECT_PATH_AFTER_EMAIL_VERIFICATION: string =
  "/sign-in";
