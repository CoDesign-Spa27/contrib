import type { Metadata } from "next";
import { Github, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { signIn } from "@/auth";
import { DEFAULT_AFTER_SIGN_IN } from "@/lib/routes";
import SignInBackdrop from "@/components/auth/sign-in-backdrop";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign in | Contribution Analyzer",
  description: "Sign in with GitHub to analyze contributions and generate insights.",
};

function normalizeCallbackUrl(value?: string | string[]) {
  if (!value || Array.isArray(value)) return DEFAULT_AFTER_SIGN_IN;
  if (value.startsWith("/")) return value;
  return DEFAULT_AFTER_SIGN_IN;
}

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string | string[] };
}) {
  const callbackUrl = normalizeCallbackUrl(searchParams?.callbackUrl);

  const handleGitHubSignIn = async (formData: FormData) => {
    "use server";
    const rawCallbackUrl = formData.get("callbackUrl");
    const redirectTo =
      typeof rawCallbackUrl === "string" && rawCallbackUrl.startsWith("/")
        ? rawCallbackUrl
        : DEFAULT_AFTER_SIGN_IN;

    await signIn("github", { redirectTo });
  };

  return (
    <main className="relative min-h-screen bg-background pt-14">
      <SignInBackdrop />
      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl grid-cols-12 items-center gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="col-span-12 space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
            GitHub · AI · Insights
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Welcome back to
            <span className="block font-instrument-serif text-primary">
              Contribution Analyzer
            </span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Connect your GitHub account to turn commit history into narrative summaries,
            track impact, and surface the parts of the codebase that truly matter.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" />
                AI summaries
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Generate concise narratives for every engineer, release, or repository.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Secure by design
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                GitHub OAuth keeps credentials safe and gives you full control.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Zap className="size-4 text-primary" />
                Fast setup
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                One-click access to dashboards, insights, and contribution analytics.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Github className="size-4 text-primary" />
                GitHub-first
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Works with public and private repos using your existing permissions.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <Card className="border border-border/60 bg-background/80 shadow-xl shadow-primary/10">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Sign in or sign up</CardTitle>
              <CardDescription>
                Use GitHub to create your account. We never access your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={handleGitHubSignIn} className="space-y-4">
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 text-base text-white"
                >
                  <Github className="size-4" />
                  Continue with GitHub
                </Button>
              </form>
              <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                You will be redirected to GitHub to authorize access. We only request
                permission to read repository data.
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-xs text-muted-foreground">
              <span>
                New here? GitHub creates your account automatically the first time you
                sign in.
              </span>
              <span className="text-foreground/80">
                Need a different destination? Update the callback URL and sign in again.
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
