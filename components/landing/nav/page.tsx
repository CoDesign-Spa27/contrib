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
                                    <Button type="button" variant="ghost" size="sm" onClick={onSignOut}>
                                        Sign out
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
