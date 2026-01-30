import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, BarChart3, Sparkles, Shield } from "lucide-react";

export default function Features() {
	return (
		<div>
            <section id="how-it-works" className="relative">
                <div className="mx-auto">
                    <div className="text-center max-w-2xl mx-auto py-14 animate-in fade-in slide-in-from-bottom-4 duration-600">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 font-instrument-serif">
                            How it works
                        </h2>
                        <p className="text-muted-foreground font-bricolage-grotesque">
                            From your GitHub data to a structured report in one flow.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 lg:gap-8 border-2 border-dashed border-primary/50 border-x-0">
                        {[
                            {
                                icon: GitBranch,
                                title: "Connect",
                                description: "Sign in with GitHub (repo scope). We use your token to read commits—no data stored.",
                                delay: "landing-stagger-1",
                                border: "border-l-0  border-r-0 sm:border-r-2 border-y-0 border-b-2 lg:border-b-0",
                            },
                            {
                                icon: BarChart3,
                                title: "Hard stats",
                                description: "We compute commit counts, feature tags (feat:), active days, and top file areas locally.",
                                delay: "landing-stagger-2",
                                border: "border-l-0 border-r-0 lg:border-r-2 border-y-0 border-b-2 lg:border-b-0",
                            },
                            {
                                icon: Sparkles,
                                title: "AI analysis",
                                description: "Compressed commit context goes to the model for a detailed summary and important work items.",
                                delay: "landing-stagger-3",
                                border: "border-l-0 border-r-0 border-b-2 sm:border-r-2 sm:border-b-0 border-y-0",
                            },
                            {
                                icon: Shield,
                                title: "One dashboard",
                                description: "View stats, analytical summary, key areas, and an activity chart in one place.",
                                delay: "landing-stagger-4",
                                border: "border-l-0 border-r-0 border-y-0 border-b-0",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className={` py-4 px-2 relative overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-dashed border-primary/50 ${item.delay} ${item.border}`}
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold font-instrument-serif">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm leading-relaxed font-bricolage-grotesque">
                                        {item.description}
                                    </CardDescription>
                                </CardContent>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

           

		</div>
	)
}