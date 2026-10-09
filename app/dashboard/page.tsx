import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name?.trim() ||
    (user.user_metadata?.full_name as string)?.trim() ||
    user.email?.split("@")[0] ||
    "User";

  const role = profile?.role || "student";

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome, {fullName}!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here is your PlaceReady overview and profile status.
            </p>
          </div>
          <form action={signOut}>
            <Button variant="outline" type="submit" className="w-full sm:w-auto">
              Sign out
            </Button>
          </form>
        </div>

        {/* Profile Error Banner if fetch failed */}
        {profileError && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
          >
            Failed to load profile details: {profileError.message}
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-semibold text-foreground">User Profile</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Full Name
              </span>
              <p className="mt-1 text-base font-semibold text-foreground">
                {fullName}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Role
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-primary">
                  {role}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <p className="mt-1 text-sm font-medium text-foreground break-all">
                {user.email}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500" />
                Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
