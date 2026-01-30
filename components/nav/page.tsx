"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import { cn } from "@/lib/utils";
import {
    motion,
    useScroll,
    useMotionValueEvent,
} from "motion/react";
import React, { useRef, useState } from "react";

export type NavVariant = "default" | "landing";

export interface NavLinkItem {
    href: string;
    label: string;
}

export interface NavProps {
    session: Session | null;
    /** Brand text (e.g. "Contribution Analyzer") */
    brandLabel?: string;
    /** Link for the brand (default "/") */
    brandHref?: string;
    /** Optional nav links shown between brand and auth (e.g. Home, About) */
    links?: NavLinkItem[];
    /** Visual style: "default" for dashboard, "landing" for marketing pages */
    variant?: NavVariant;
    className?: string;
    /** Custom content to render on the right (overrides default auth UI when provided) */
    rightContent?: React.ReactNode;
    /** Callback for sign in action */
    onSignIn?: () => void;
    /** Callback for sign out action */
    onSignOut?: () => void;
}

export default function Nav({
    session,
    brandLabel = "Contribution Analyzer",
    brandHref = "/",
    links = [],
    variant = "landing",
    className,
    rightContent,
    onSignIn,
    onSignOut,
}: NavProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    if (rightContent !== undefined) {
        return (
            <motion.div
                ref={ref}
                className={cn("fixed inset-x-0 top-0 z-40 w-full pointer-events-none", className)}
            >
                <motion.header
                    animate={{
                        boxShadow: visible
                            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                            : "none",
                        width: visible ? "40%" : "100%",
                        y: visible ? 20 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 50,
                    }}
                    style={{
                        minWidth: "800px",
                    }}
                    className={cn(
                        "relative z-[60] mx-auto w-full max-w-7xl rounded-full px-4 py-2 backdrop-blur-lg bg-white/80 dark:bg-neutral-700 pointer-events-auto",
                    )}
                >
                    <div className="flex items-center justify-between">
                        <Link href={brandHref} className="relative z-20 text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors">
                            {brandLabel}
                        </Link>
                        {links.length > 0 && (
                            <nav className="flex items-center gap-6" aria-label="Main">
                                {links.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        )}
                        <div className="flex items-center gap-3">{rightContent}</div>
                    </div>
                </motion.header>
            </motion.div>
        );
    }

    // Default auth-aware UI
    return (
        <motion.div
            ref={ref}
            className={cn("fixed inset-x-0 top-0 z-40 w-full pointer-events-none", className)}
        >
            <motion.header
                animate={{
                    boxShadow: visible
                        ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                        : "none",
                    width: visible ? "40%" : "100%",
                    y: visible ? 20 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 50,
                }}
                style={{
                    minWidth: "800px",
                }}
                className={cn(
                    "relative z-[60] mx-auto w-full max-w-7xl rounded-full px-6 py-4 backdrop-blur-sm  pointer-events-auto",
                )}
            >
                <div className="flex items-center justify-between">
                    <Link href={brandHref} className="relative z-20 text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors">
                        {brandLabel}
                    </Link>
                    {links.length > 0 && (
                        <nav className="flex items-center gap-6" aria-label="Main">
                            {links.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                    <div className="flex items-center gap-3">
                        {session ? (
                            <>
                                {session.user?.image && (
                                    <Image
                                        src={session.user.image}
                                        alt=""
                                        width={32}
                                        height={32}
                                        className="rounded-full ring-1 ring-border"
                                    />
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {session.user?.name ?? session.user?.email ?? "Signed in"}
                                </span>
                                <SignOutButton onSignOut={onSignOut} />
                            </>
                        ) : (
                            <SignInButton onSignIn={onSignIn} />
                        )}
                    </div>
                </div>
            </motion.header>
        </motion.div>
    );
}

function SignInButton({ onSignIn }: { onSignIn?: () => void }) {
    return (
        <Button 
            type="button" 
            size="sm" 
            className="gap-2"
            onClick={onSignIn}
        >
            <Github className="size-4" />
            Sign in with GitHub
        </Button>
    );
}

function SignOutButton({ onSignOut }: { onSignOut?: () => void }) {
    return (
        <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onSignOut}
        >
            Sign out
        </Button>
    );
}
