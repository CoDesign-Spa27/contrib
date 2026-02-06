/**
 * Route configuration for auth-aware routing.
 * Keeps protected and public routes in one place for middleware and pages.
 */

/** Paths that require an authenticated session */
export const PROTECTED_PATHS = ["/dashboard"] as const;

/** Paths that authenticated users should be redirected away from (e.g. to app) */
export const GUEST_ONLY_PATHS = ["/", "/sign-in"] as const;

export function isProtectedPath(pathname: string): boolean {
	return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isGuestOnlyPath(pathname: string): boolean {
	return GUEST_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Default destination after sign-in when no callbackUrl is set */
export const DEFAULT_AFTER_SIGN_IN = "/dashboard";
