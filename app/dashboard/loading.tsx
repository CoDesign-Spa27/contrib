import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-background pt-14">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="col-span-12 space-y-4">
          {/* Form skeleton */}
          <Card className="border-border/50">
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
                <div className="space-y-2 lg:col-span-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
                </div>
                <div className="space-y-2 lg:col-span-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
                </div>
                <div className="space-y-2 lg:col-span-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
                </div>
                <div className="flex items-end lg:col-span-2">
                  <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
