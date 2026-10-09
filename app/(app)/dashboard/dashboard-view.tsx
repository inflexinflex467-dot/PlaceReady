"use client";

import { useState } from "react";
import { signOutAction } from "../actions";
import { Button } from "@/components/ui/button";

interface DashboardViewProps {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    full_name?: string | null;
    role?: string | null;
  } | null;
}

export function DashboardView({ user, profile }: DashboardViewProps) {
  const [viewMode, setViewMode] = useState<"populated" | "empty">("populated");
  const [reminderSet, setReminderSet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fullName =
    profile?.full_name?.trim() ||
    user.email?.split("@")[0] ||
    "Rohan Verma";

  const email = user.email || "student@college.edu";
  const role = profile?.role || "student";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((w: string) => w[0].toUpperCase())
      .slice(0, 2)
      .join("") || "RS";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleReminderToggle = () => {
    const next = !reminderSet;
    setReminderSet(next);
    showToast(
      next
        ? "Reminder synced with college calendar!"
        : "Reminder removed."
    );
  };

  const handleStreakClick = () => {
    if (viewMode === "empty") {
      showToast("Start your practice streak today! Solve 1 question daily.");
    } else {
      showToast("🔥 14-day streak active! Keep solving 1 question daily.");
    }
  };

  return (
    <main className="flex-1 flex flex-col relative w-full pt-4 md:pt-8 pb-24 md:pb-12 bg-surface px-margin-sm sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* State Mode Switcher (Allows testing Populated vs Empty states) */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-surface-container">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          Dashboard Demo State:
        </span>
        <div className="flex items-center bg-surface-container p-1 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode("populated")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "populated"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Active Data
          </button>
          <button
            type="button"
            onClick={() => setViewMode("empty")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "empty"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Empty State
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full gap-space-md">
        {/* 1. Welcome Header & Academic Profile */}
        <section className="flex flex-col gap-space-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container text-base font-bold shadow-xs shrink-0">
                {initials}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                    Welcome back, {fullName}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[11px] font-semibold capitalize shrink-0">
                    {role}
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">
                  {email}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                aria-label="Practice Streak"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-tertiary-container/15 text-on-tertiary-fixed font-label-sm text-label-sm min-h-[44px] hover:bg-tertiary-container/25 active:scale-95 transition-all cursor-pointer shadow-xs"
                id="streakBtn"
                onClick={handleStreakClick}
                type="button"
              >
                <span className="text-sm select-none">Streak:</span>
                <span className="font-bold">
                  {viewMode === "empty" ? "0 Days" : "14 Days"}
                </span>
              </button>

              <form action={signOutAction}>
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="min-h-[44px] px-3 gap-1.5 text-xs font-semibold cursor-pointer border-outline-variant/50 hover:bg-destructive/10 hover:text-destructive"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </form>
            </div>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Computer Science &amp; Engg • Batch of 2025 • Tier-1 Campus
          </p>

          {/* Streak micro-banner */}
          <div className="flex items-center justify-between px-space-sm py-2.5 rounded-xl bg-surface-container-high shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                verified
              </span>
              <span className="font-caption text-caption text-on-surface font-medium">
                {viewMode === "empty"
                  ? "Start your consistency streak by solving 1 question today"
                  : "Top 5% consistency this week"}
              </span>
            </div>
            <span className="font-caption text-caption text-on-surface-variant font-semibold">
              {viewMode === "empty" ? "Get Started" : "Keep it up!"}
            </span>
          </div>
        </section>

        {/* 2. Placement Readiness Score Card */}
        <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm border border-surface-container">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-medium">
                Placement Status
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5 font-bold">
                Readiness Score
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              {viewMode === "empty" ? "Diagnostic Needed" : "Tier-1 Target"}
            </span>
          </div>

          {viewMode === "empty" ? (
            /* Empty State for Readiness Score */
            <div className="py-6 flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-3">
                <span className="material-symbols-outlined text-[32px]">speed</span>
              </div>
              <h3 className="text-base font-semibold text-on-surface">
                No Diagnostic Score Available Yet
              </h3>
              <p className="text-sm text-on-surface-variant max-w-sm mt-1 mb-4 leading-relaxed">
                Take your first 30-minute diagnostic test to calibrate your aptitude, DSA, and CS readiness score.
              </p>
              <Button className="cursor-pointer gap-2 bg-primary text-on-primary hover:bg-primary-container">
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                <span>Start Diagnostic Test</span>
              </Button>
            </div>
          ) : (
            /* Populated State with Circular Progress Gauge & Breakdown */
            <>
              {/* Circular Progress Gauge */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg
                    aria-label="78% Placement Readiness progress circle"
                    className="w-full h-full -rotate-90"
                    role="img"
                    viewBox="0 0 120 120"
                  >
                    {/* Background track */}
                    <circle
                      className="text-surface-container-high"
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="11"
                    />
                    {/* Progress arc (78% of 314 = 244.92) */}
                    <circle
                      className="text-primary-container"
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      stroke="currentColor"
                      strokeDasharray="314.159"
                      strokeDashoffset="69.115"
                      strokeLinecap="round"
                      strokeWidth="11"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">
                      78%
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant font-medium">
                      Calibrated
                    </span>
                  </div>
                </div>
              </div>

              {/* Peer Comparison Benchmark */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  school
                </span>
                <p className="font-body-sm text-body-sm font-medium">
                  Higher than <span className="font-bold text-primary">84%</span> of your college batch
                </p>
              </div>

              {/* Metric Breakdown Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="flex flex-col p-2.5 rounded-lg bg-surface-container">
                  <div className="flex justify-between items-center text-on-surface-variant font-caption text-caption">
                    <span>Aptitude</span>
                    <span className="font-bold text-on-surface">85%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                <div className="flex flex-col p-2.5 rounded-lg bg-surface-container">
                  <div className="flex justify-between items-center text-on-surface-variant font-caption text-caption">
                    <span>Data Structures</span>
                    <span className="font-bold text-on-surface">74%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: "74%" }} />
                  </div>
                </div>

                <div className="flex flex-col p-2.5 rounded-lg bg-surface-container">
                  <div className="flex justify-between items-center text-on-surface-variant font-caption text-caption">
                    <span>Core CS &amp; DBMS</span>
                    <span className="font-bold text-on-surface">82%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>

                <div className="flex flex-col p-2.5 rounded-lg bg-surface-container">
                  <div className="flex justify-between items-center text-on-surface-variant font-caption text-caption">
                    <span>HR &amp; Sys Design</span>
                    <span className="font-bold text-on-surface">70%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* 3. Upcoming Tests & Proctored Drives */}
        <section className="flex flex-col gap-space-xs" id="mock-tests">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Upcoming Tests
            </h2>
            {viewMode === "populated" && (
              <button
                type="button"
                className="font-label-md text-label-md text-primary font-semibold min-h-[44px] px-2 flex items-center hover:opacity-80 transition-opacity cursor-pointer"
              >
                View All (4)
              </button>
            )}
          </div>

          {viewMode === "empty" ? (
            /* Empty State for Upcoming Tests */
            <div className="rounded-xl bg-surface-container-lowest p-6 text-center border border-surface-container shadow-xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[26px]">event_busy</span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface">
                No Tests Currently Scheduled
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5 max-w-xs mb-3">
                You have no proctored mock drives on your calendar for this week.
              </p>
              <Button variant="outline" size="sm" className="cursor-pointer gap-1.5 text-xs">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Schedule Mock Test</span>
              </Button>
            </div>
          ) : (
            <>
              {/* Test Card 1: TCS NQT Mock */}
              <div className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm flex flex-col gap-space-xs border border-surface-container">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-error px-2 py-0.5 rounded-full bg-error-container/40 w-fit mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                      Tomorrow • 10:00 AM
                    </span>
                    <h3 className="font-body-base-medium text-body-base-medium text-on-surface font-semibold">
                      TCS National Qualifier Mock
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                      120 mins • Live AI Proctoring • 90 Questions
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      assignment_turned_in
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    className="h-11 min-h-[44px] rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer"
                    id="reminderBtn"
                    onClick={handleReminderToggle}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {reminderSet ? "check_circle" : "notifications_active"}
                    </span>
                    <span className={reminderSet ? "text-secondary font-semibold" : ""}>
                      {reminderSet ? "Reminder Set" : "Remind Me"}
                    </span>
                  </button>
                  <button
                    className="h-11 min-h-[44px] rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      menu_book
                    </span>
                    <span>Syllabus</span>
                  </button>
                </div>
              </div>

              {/* Test Card 2: Amazon SDE-1 Code Sprint */}
              <div className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm flex flex-col gap-space-xs border border-surface-container">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center text-[11px] font-semibold text-tertiary px-2 py-0.5 rounded-full bg-tertiary-fixed w-fit mb-1">
                      3 Days Left
                    </span>
                    <h3 className="font-body-base-medium text-body-base-medium text-on-surface font-semibold">
                      Amazon SDE-1 Code Sprint
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                      DSA Trees &amp; Graphs • Low-Level Design • 3 Hard Problems
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">terminal</span>
                  </div>
                </div>
                <button
                  className="h-11 min-h-[44px] w-full rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container-high active:scale-[0.98] transition-all mt-1 cursor-pointer"
                  type="button"
                >
                  <span>Prepare Sprint Modules</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </>
          )}
        </section>

        {/* 4. Recommended Next Actions */}
        <section className="flex flex-col gap-space-xs" id="coding-arena">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Next Priority Actions
              </h2>
              <span className="font-caption text-caption text-on-surface-variant">
                Recommended based on mock score diagnosis
              </span>
            </div>
          </div>

          {viewMode === "empty" ? (
            /* Empty State for Actions */
            <div className="rounded-xl bg-surface-container-lowest p-6 text-center border border-surface-container shadow-xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[26px]">task_alt</span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface">
                All Daily Goals Completed
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5 max-w-xs mb-3">
                Great job! No pending remediation modules.
              </p>
            </div>
          ) : (
            <>
              {/* Action 1: High Priority DP */}
              <div className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm flex flex-col gap-2 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-error px-2 py-0.5 rounded-full bg-error-container/40">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    High Priority • ~25 mins
                  </span>
                  <span className="font-caption text-caption text-secondary font-bold">
                    +4% Readiness
                  </span>
                </div>
                <h3 className="font-body-base-medium text-body-base-medium text-on-surface font-semibold">
                  Solve 3 Dynamic Programming problems to strengthen DSA core
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">code_blocks</span>
                    Knapsack &amp; Subsequences
                  </span>
                  <button
                    className="h-11 min-h-[44px] px-4 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    <span>Start</span>
                    <span className="material-symbols-outlined text-[18px]">
                      play_arrow
                    </span>
                  </button>
                </div>
              </div>

              {/* Action 2: Daily Aptitude Drill */}
              <div className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm flex flex-col gap-2 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary px-2 py-0.5 rounded-full bg-secondary-container">
                    Daily Goal • ~15 mins
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    10 Questions
                  </span>
                </div>
                <h3 className="font-body-base-medium text-body-base-medium text-on-surface font-semibold">
                  Mock Aptitude Speed Drill on Time, Speed &amp; Distance
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    Quantitative Aptitude
                  </span>
                  <button
                    className="h-11 min-h-[44px] px-4 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    <span>Practice</span>
                    <span className="material-symbols-outlined text-[18px]">
                      navigate_next
                    </span>
                  </button>
                </div>
              </div>

              {/* Action 3: Review AI Interview Feedback */}
              <div className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm flex flex-col gap-2 border border-surface-container" id="ai-interviews">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant px-2 py-0.5 rounded-full bg-surface-container-highest">
                    Review Needed
                  </span>
                  <span className="font-caption text-caption text-primary font-semibold">
                    Ready to View
                  </span>
                </div>
                <h3 className="font-body-base-medium text-body-base-medium text-on-surface font-semibold">
                  Review AI Mock Interview feedback on Operating Systems &amp; OOPs
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">smart_toy</span>
                    Audio &amp; Speech Clarity: 8.5/10
                  </span>
                  <button
                    className="h-11 min-h-[44px] px-4 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    <span>Feedback</span>
                    <span className="material-symbols-outlined text-[18px]">
                      description
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* 5. Interactive Toast / Quick Feedback Banner */}
        {toastMessage && (
          <div
            className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-50 transition-all duration-300 rounded-xl bg-inverse-surface text-inverse-on-surface p-space-sm shadow-lg flex items-center justify-between gap-3 max-w-sm"
            id="toastNotification"
            role="status"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
                alarm_on
              </span>
              <span className="font-body-sm text-body-sm font-medium" id="toastMessage">
                {toastMessage}
              </span>
            </div>
            <button
              aria-label="Dismiss toast"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95 text-inverse-on-surface cursor-pointer shrink-0"
              onClick={() => setToastMessage(null)}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
