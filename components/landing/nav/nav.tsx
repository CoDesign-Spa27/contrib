"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { ModeToggle } from "@/components/ui/mode-toggle";

export type NavVariant = "default" | "landing";

export interface NavLinkItem {
    href: string;
    label: string;
}

export interface NavProps {
    session: Session | null;
    brandLabel?: string;
    brandHref?: string;
    links?: NavLinkItem[];
    variant?: NavVariant;
    className?: string;
    rightContent?: React.ReactNode;
    onSignIn?: () => void;
    onSignOut?: () => void;
    signInHref?: string;
}

export default function Nav({
    session,
    brandLabel = "Contrib",
    brandHref = "/",
    links = [],
    className = "",
    rightContent,
    onSignIn,
    onSignOut,
    signInHref = "/sign-in",
}: NavProps) {
    return (
        <header
            className={`fixed inset-x-0 top-0 z-40 border-b border-border/50 backdrop-blur-md ${className}`}
        >
            <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main">
                <Link
                    href={brandHref}
                    className="font-bricolage-grotesque text-2xl font-medium text-foreground hover:text-foreground/80 transition-colors"
                >
                    {brandLabel}
                </Link>

                {links.length > 0 && (
                    <div className="flex items-center gap-6">
                        {links.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-3">

                    {rightContent ?? (
                        <>
                            <ModeToggle />
                            {session ? (
                                <>
                                    <span className="text-sm text-muted-foreground">
                                        {session.user?.name ?? session.user?.email ?? "Signed in"}
                                    </span>
                                    <Button type="button" variant="ghost" size="sm" onClick={onSignOut} className="flex items-center gap-2">
                                        Sign out

                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 18 18">
                                            <path opacity="0.4" d="M2.5 14.75V3.25C2.5 2.2852 3.2852 1.5 4.25 1.5H10.75C11.7148 1.5 12.5 2.2852 12.5 3.25V14.75C12.5 15.7148 11.7148 16.5 10.75 16.5H4.25C3.2852 16.5 2.5 15.7148 2.5 14.75Z" fill="currentColor" data-color="color-2"></path>
                                            <path d="M8.00099 5.55711V12.4438C8.00099 13.0527 7.69239 13.6084 7.17389 13.9311L3.40099 16.2705C2.86639 15.9707 2.50009 15.4053 2.50009 14.75V3.25001C2.50009 2.59521 2.86609 2.02981 3.40019 1.73001L7.17389 4.0694C7.69149 4.3907 8.00099 4.94671 8.00099 5.55711Z" fill="currentColor"></path>
                                            <path d="M17.78 8.46999L15.03 5.71999C14.737 5.42699 14.262 5.42699 13.969 5.71999C13.676 6.01299 13.676 6.48799 13.969 6.78099L15.439 8.25099H11.25C10.836 8.25099 10.5 8.58699 10.5 9.00099C10.5 9.41499 10.836 9.75099 11.25 9.75099H15.439L13.969 11.221C13.676 11.514 13.676 11.989 13.969 12.282C14.115 12.428 14.307 12.502 14.499 12.502C14.691 12.502 14.883 12.429 15.029 12.282L17.779 9.53199C18.072 9.23899 18.072 8.76399 17.779 8.47099L17.78 8.46999Z" fill="currentColor"></path>
                                        </svg>
                                    </Button>
                                </>
                            ) : (
                                onSignIn ? (
                                    <Button type="button" size="sm" className="gap-2 text-white" onClick={onSignIn}>
                                        <Github className="size-4" />
                                        Sign in
                                    </Button>
                                ) : (
                                    <Button asChild type="button" size="sm" className="gap-2 text-white">
                                        <Link href={signInHref}>
                                            <Github className="size-4" />
                                            Sign in
                                        </Link>
                                    </Button>
                                )
                            )}
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
