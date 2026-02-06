"use client";
import { Dithering } from '@paper-design/shaders-react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { useTheme } from "next-themes";

export default function Hero() {
	const { theme } = useTheme();
	const isDark = theme === "dark";
	const router = useRouter();
	const handleDashboard = () => {
		router.push("/dashboard");
	}
	return (
		<div className="relative w-full min-h-screen flex items-center justify-center">
			<div className="absolute inset-0 -z-10 dark:opacity-30 opacity-60 pointer-events-none">
				<Dithering
					style={{ width: '100%', height: '100%' }}
					colorBack={isDark ? "#0D0A0A" : "#ffffff"}
					colorFront="#00ffbf"
					shape="warp"
					type="4x4"
					size={1.2}
					speed={0.08}
					scale={2.12}
					offsetX={1}
				/>
			</div>

			<div className="flex flex-col items-center justify-center z-10 gap-4">
				<span>
					<p className="text-sm font-medium tracking-wide uppercase">
						GitHub · AI · Insights
					</p>
				</span>
				<h1 className="z-10 max-w-4xl text-center text-4xl sm:text-5xl md:text-7xl font-bricolage-grotesque tracking-wider font-bold text-foreground text-balance capitalize">
					Turn commit history into{" "}
					<span className="text-primary relative font-instrument-serif">
						analytical summaries.
					</span>
				</h1>

				<div>
					<Button
						onClick={handleDashboard}
						className="text-white text-base gap-2 flex items-center justify-center"
					>
						Visualize
						<FaSquareArrowUpRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
