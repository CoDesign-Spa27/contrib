import Hero from "@/components/hero/page";
 

export default async function HomePage() {
 
  return (
    <div className="max-w-7xl mx-auto w-full h-full ">
      <Hero />

      {/* <main className="relative z-10"> */}
        {/* Hero */}
     
          {/* <div className="max-w-3xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <p className="text-sm font-medium text-primary tracking-wide uppercase">
              GitHub · AI · Insights
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
              Turn commit history into{" "}
              <span className="text-primary relative">
                analytical summaries
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Pick a repo, branch, and developer. We fetch commits, run the numbers, and use AI to surface what actually got built—features, impact, and key areas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <form
                action={async () => {
                  "use server";
                  await signIn("github", { redirectTo: "/" });
                }}
              >
                <Button type="submit" size="lg" className="gap-2 text-base px-8 h-11 rounded-lg shadow-lg shadow-primary/20">
                  <Github className="size-5" />
                  Sign in with GitHub to start
                </Button>
              </form>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                See how it works →
              </Link>
            </div>
          </div> */}
 

        {/* How it works / Features */}
        {/* <section id="how-it-works" className="relative py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-600">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
                How it works
              </h2>
              <p className="text-muted-foreground">
                From your GitHub data to a structured report in one flow.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  icon: GitBranch,
                  title: "Connect",
                  description: "Sign in with GitHub (repo scope). We use your token to read commits—no data stored.",
                  delay: "landing-stagger-1",
                },
                {
                  icon: BarChart3,
                  title: "Hard stats",
                  description: "We compute commit counts, feature tags (feat:), active days, and top file areas locally.",
                  delay: "landing-stagger-2",
                },
                {
                  icon: Sparkles,
                  title: "AI analysis",
                  description: "Compressed commit context goes to the model for a detailed summary and important work items.",
                  delay: "landing-stagger-3",
                },
                {
                  icon: Shield,
                  title: "One dashboard",
                  description: "View stats, analytical summary, key areas, and an activity chart in one place.",
                  delay: "landing-stagger-4",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className={`relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 ${item.delay}`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                    <svg viewBox="0 0 100 100" fill="currentColor" className="text-primary">
                      <circle cx="80" cy="20" r="40" />
                    </svg>
                  </div>
                  <CardHeader>
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <item.icon className="size-5" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
 
        <section className="relative py-16 px-4 sm:px-6" aria-hidden>
          <div className="max-w-4xl mx-auto">
            <svg
              className="w-full h-auto opacity-20 dark:opacity-30"
              viewBox="0 0 600 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="commitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="600" height="140" fill="url(#commitGrad)" className="text-primary" />
              {[20, 50, 80, 110].map((y, i) => (
                <g key={i}>
                  <rect x={20 + i * 12} y={y} width="8" height="8" rx="2" fill="currentColor" className="text-primary" opacity={0.4 + i * 0.1} />
                  <line x1={36 + i * 12} y1={y + 4} x2={120} y2={y + 4} stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                  <rect x="120" y={y - 2} width={200 + i * 20} height="12" rx="4" fill="currentColor" opacity="0.06" />
                </g>
              ))}
            </svg>
          </div>
        </section>
 
        <section className="relative py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              Ready to analyze contributions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Sign in with GitHub. We only read repo data with your permission and use it to generate the report.
            </p>
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/" });
              }}
            >
              <Button type="submit" size="lg" className="gap-2 text-base px-8 h-12 rounded-lg">
                <Github className="size-5" />
                Sign in with GitHub
              </Button>
            </form>
          </div>
        </section>

        <footer className="relative border-t border-border/50 py-8 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>Contribution Analyzer</span>
            <span>GitHub + AI · No data stored</span>
          </div>
        </footer>
      </main> */}
    </div>
  );
}
