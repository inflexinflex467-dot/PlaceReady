"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "./actions";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    id: string;
    email?: string;
  };
  profile: {
    full_name?: string | null;
    role?: string | null;
  } | null;
}

const DESKTOP_NAV_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/tests", icon: "assignment", label: "Mock Tests" },
  { href: "/code", icon: "code", label: "Coding Arena" },
  { href: "/interview", icon: "mic", label: "AI Interviews" },
  { href: "/resume", icon: "description", label: "ATS Resume" },
  { href: "/courses", icon: "school", label: "Courses" },
  { href: "/leaderboard", icon: "leaderboard", label: "Leaderboard" },
];

export function AppShell({ children, user, profile }: AppShellProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);

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
      .join("") || "PR";

  const isRouteActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const isMoreRouteActive =
    isMoreOpen ||
    pathname.startsWith("/resume") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/leaderboard");

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 1. Desktop Sidebar (hidden on mobile, visible on md+) */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 lg:w-72 bg-surface-container-lowest border-r border-surface-container z-40 flex-col justify-between p-4 shadow-xs">
        <div className="flex flex-col">
          {/* Brand Header */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-2 py-3 mb-6 transition-opacity hover:opacity-90"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold leading-none">
                PlaceReady
              </span>
              <span className="font-caption text-caption text-on-surface-variant font-medium mt-1">
                Campus Placement Hub
              </span>
            </div>
          </Link>

          {/* Navigation Links with Active Highlighting */}
          <nav className="flex flex-col gap-1">
            {DESKTOP_NAV_ITEMS.map((item) => {
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-primary-fixed text-on-primary-fixed font-semibold shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-medium"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      active ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card & Sign Out on Sidebar Footer */}
        <div className="pt-4 border-t border-surface-container flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low shadow-xs">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{fullName}</p>
              <p className="text-xs text-on-surface-variant truncate">{email}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wide">
                {role}
              </span>
            </div>
          </div>

          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-outline-variant/40 hover:bg-destructive/10 text-on-surface hover:text-destructive text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* 2. Mobile Top Header (fixed on mobile, hidden on md+) */}
      <header className="md:hidden fixed top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container/40">
        <div className="h-16 px-margin-sm flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-space-xs">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none font-bold">
                PlaceReady
              </span>
              <span className="font-caption text-caption text-on-surface-variant font-medium mt-0.5">
                Campus Placement Hub
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors relative"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
            </button>

            <button
              onClick={() => setIsMoreOpen(true)}
              aria-label="Open User Menu"
              className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-xs font-bold text-xs cursor-pointer"
              type="button"
            >
              {initials}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col md:pl-64 lg:pl-72 w-full pt-16 md:pt-0 pb-20 md:pb-0 transition-all">
        {children}
      </div>

      {/* 4. Mobile Bottom Tab Bar (fixed on mobile, hidden on md+) */}
      <nav
        className="md:hidden fixed bottom-0 w-full z-40 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)] border-t border-surface-container/60"
        aria-label="Mobile Navigation"
      >
        <div className="flex justify-between items-center h-16 px-space-xs">
          {/* Tab 1: Dashboard */}
          <Link
            className={`flex-1 h-11 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isRouteActive("/dashboard")
                ? "text-primary-container font-semibold"
                : "text-on-surface-variant"
            }`}
            href="/dashboard"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isRouteActive("/dashboard")
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              dashboard
            </span>
            <span className="font-caption text-caption">Dashboard</span>
          </Link>

          {/* Tab 2: Tests */}
          <Link
            className={`flex-1 h-11 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isRouteActive("/tests")
                ? "text-primary-container font-semibold"
                : "text-on-surface-variant"
            }`}
            href="/tests"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isRouteActive("/tests")
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              assignment
            </span>
            <span className="font-caption text-caption">Tests</span>
          </Link>

          {/* Tab 3: Code */}
          <Link
            className={`flex-1 h-11 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isRouteActive("/code")
                ? "text-primary-container font-semibold"
                : "text-on-surface-variant"
            }`}
            href="/code"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isRouteActive("/code")
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              code
            </span>
            <span className="font-caption text-caption">Code</span>
          </Link>

          {/* Tab 4: Interview */}
          <Link
            className={`flex-1 h-11 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isRouteActive("/interview")
                ? "text-primary-container font-semibold"
                : "text-on-surface-variant"
            }`}
            href="/interview"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isRouteActive("/interview")
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              mic
            </span>
            <span className="font-caption text-caption">Interview</span>
          </Link>

          {/* Tab 5: More (Opens Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={`flex-1 h-11 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              isMoreRouteActive
                ? "text-primary-container font-semibold"
                : "text-on-surface-variant"
            }`}
            aria-label="Open More Menu"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isMoreRouteActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              grid_view
            </span>
            <span className="font-caption text-caption">More</span>
          </button>
        </div>
      </nav>

      {/* 5. Mobile "More" Bottom Sheet Modal */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet Container */}
          <div
            className="relative z-50 w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-6 border-t border-surface-container animate-in slide-in-from-bottom duration-200 pb-8 max-h-[85vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="More navigation and profile"
          >
            {/* Grabber Handle */}
            <div className="w-12 h-1.5 rounded-full bg-surface-container-highest mx-auto mb-5" />

            {/* User Profile Bar inside Sheet */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {fullName}
                    </p>
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                      {role}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                aria-label="Close sheet"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Navigation List inside Bottom Sheet */}
            <div className="flex flex-col gap-1.5">
              {/* 1. Resume */}
              <Link
                href="/resume"
                onClick={() => setIsMoreOpen(false)}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                  isRouteActive("/resume")
                    ? "bg-primary-fixed text-on-primary-fixed font-semibold"
                    : "hover:bg-surface-container-low text-on-surface"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-semibold">Resume Builder</span>
                  <span className="text-xs text-on-surface-variant">
                    ATS optimization &amp; placement templates
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  chevron_right
                </span>
              </Link>

              {/* 2. Courses */}
              <Link
                href="/courses"
                onClick={() => setIsMoreOpen(false)}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                  isRouteActive("/courses")
                    ? "bg-primary-fixed text-on-primary-fixed font-semibold"
                    : "hover:bg-surface-container-low text-on-surface"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-semibold">Courses &amp; Modules</span>
                  <span className="text-xs text-on-surface-variant">
                    DSA concept notes &amp; video tutorials
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  chevron_right
                </span>
              </Link>

              {/* 3. Leaderboard */}
              <Link
                href="/leaderboard"
                onClick={() => setIsMoreOpen(false)}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                  isRouteActive("/leaderboard")
                    ? "bg-primary-fixed text-on-primary-fixed font-semibold"
                    : "hover:bg-surface-container-low text-on-surface"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">leaderboard</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-semibold">Campus Leaderboard</span>
                  <span className="text-xs text-on-surface-variant">
                    Batch rankings &amp; percentile status
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  chevron_right
                </span>
              </Link>

              {/* 4. Profile Details Accordion / Modal */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setShowProfileDetails(!showProfileDetails)}
                  className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-surface-container-low text-on-surface transition-all cursor-pointer w-full text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold">Profile &amp; Account</span>
                    <span className="text-xs text-on-surface-variant">
                      Account credentials &amp; college status
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    {showProfileDetails ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {showProfileDetails && (
                  <div className="mx-3 mt-1 mb-2 p-3.5 rounded-xl bg-surface-container-low text-xs space-y-2 border border-surface-container">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Full Name:</span>
                      <span className="font-semibold text-on-surface">{fullName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Email:</span>
                      <span className="font-semibold text-on-surface">{email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Role:</span>
                      <span className="font-semibold text-primary capitalize">{role}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Batch:</span>
                      <span className="font-semibold text-on-surface">Class of 2025</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Sign Out */}
              <div className="pt-3 mt-2 border-t border-surface-container">
                <form action={signOutAction} className="w-full">
                  <button
                    type="submit"
                    className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
