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
		<div>
			<AnalysisDashboard accessToken={accessToken} />
		</div>
	);
}