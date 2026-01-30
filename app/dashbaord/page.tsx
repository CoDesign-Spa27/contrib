import { auth } from "@/auth";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/api/auth/signin?callbackUrl=/dashbaord");
	}

	const accessToken = session.accessToken ?? null;

	return (
		<main className="min-h-screen bg-background pt-14">
			<div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-8 sm:px-6 lg:px-8">
				<div className="col-span-12">
					<AnalysisDashboard accessToken={accessToken} />
				</div>
			</div>
		</main>
	);
}
