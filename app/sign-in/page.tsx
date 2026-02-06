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

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const resolvedParams = await searchParams;
  const callbackUrl = normalizeCallbackUrl(resolvedParams?.callbackUrl);

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
    <main className="relative min-h-screen   pt-14">
      <SignInBackdrop />
      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl grid-cols-12 items-center gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="col-span-12 space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground shadow-sm">
            GitHub · AI · Insights
          </div>
          <h1 className="font-instrument-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Welcome back to
            <span className="font-bricolage-grotesque text-primary pl-2">
              Contrib
            </span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Connect your GitHub account to turn commit history into narrative summaries,
            track impact, and surface the parts of the codebase that truly matter.
          </p>
   
        </div>
        <div className="col-span-12 lg:col-span-5">
          <Card className="border border-border/60 bg-background/80 shadow-xl shadow-primary/50">
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
            </CardContent>
          
          </Card>
        </div>
      </div>
    </main>
  );
}
