import { auth } from "@/auth";
import { DEFAULT_AFTER_SIGN_IN, isGuestOnlyPath, isProtectedPath } from "@/lib/routes";
import { NextResponse } from "next/server";

export default auth((req) => {
	const { pathname } = req.nextUrl;
	const isLoggedIn = !!req.auth;

	// Protect dashboard (and any future protected routes): redirect to sign-in with callbackUrl
	if (isProtectedPath(pathname) && !isLoggedIn) {
		const signInUrl = new URL("/sign-in", req.nextUrl.origin);
		signInUrl.searchParams.set("callbackUrl", pathname);
		return NextResponse.redirect(signInUrl);
	}

	// Redirect logged-in users away from guest-only pages (e.g. landing) to app
	if (isGuestOnlyPath(pathname) && isLoggedIn) {
		return NextResponse.redirect(new URL(DEFAULT_AFTER_SIGN_IN, req.nextUrl.origin));
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - api/auth (NextAuth routes)
		 * - _next/static, _next/image (static files)
		 * - favicon.ico, other static assets
		 */
		"/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
