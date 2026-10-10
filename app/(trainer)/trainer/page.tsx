import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/(app)/actions";

export const instant = false;

export default async function TrainerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name?.trim() || user.email?.split("@")[0] || "Trainer";

  return (
    <main className="min-h-screen bg-surface text-on-surface flex flex-col antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-surface-container-lowest border-b border-surface-container-high px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              co_present
            </span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
              PlaceReady
            </p>
            <p className="font-caption text-caption text-secondary leading-tight">
              Trainer Console
            </p>
          </div>
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-label-sm text-label-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            Sign out
          </button>
        </form>
      </header>

      {/* Body */}
      <div className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        {/* Welcome card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md mb-8 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary flex-shrink-0">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              co_present
            </span>
          </div>
          <div>
            <p className="font-caption text-caption text-secondary font-medium mb-0.5">
              Welcome back
            </p>
            <h1 className="font-headline-sm-mobile text-headline-sm-mobile text-on-surface font-bold">
              {fullName}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-xs text-xs font-semibold">
                <span className="material-symbols-outlined text-[12px]">
                  verified
                </span>
                {profile?.role === "admin" ? "Administrator" : "Trainer"}
              </span>
              <span className="text-caption text-on-surface-variant text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* Trainer dashboard placeholder */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xs flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px]">
              construction
            </span>
          </div>
          <div>
            <h2 className="font-title-md text-title-md text-on-surface font-semibold mb-1">
              Trainer Dashboard
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
              Batch management, student analytics, and test assignment tools are
              coming soon. Stay tuned!
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {[
              { icon: "groups", label: "Manage Batches" },
              { icon: "assignment", label: "Assign Tests" },
              { icon: "analytics", label: "View Analytics" },
              { icon: "leaderboard", label: "Leaderboard" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-label-sm text-label-sm opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
