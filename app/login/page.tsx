"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { createClient } from "@/lib/supabase/client";
import { signUpAction, signInAction } from "./actions";

const inter = Inter({ subsets: ["latin"] });

function getPasswordStrength(val: string) {
  if (!val || val.length === 0) {
    return {
      label: "None",
      colorClass: "text-on-surface-variant",
      bars: [
        "bg-surface-container",
        "bg-surface-container",
        "bg-surface-container",
        "bg-surface-container",
      ],
    };
  }
  if (val.length < 5) {
    return {
      label: "Weak",
      colorClass: "text-error font-medium",
      bars: [
        "bg-error",
        "bg-surface-container",
        "bg-surface-container",
        "bg-surface-container",
      ],
    };
  }
  if (val.length < 8) {
    return {
      label: "Fair",
      colorClass: "text-tertiary font-medium",
      bars: [
        "bg-tertiary-container",
        "bg-tertiary-container",
        "bg-surface-container",
        "bg-surface-container",
      ],
    };
  }
  if (val.length < 11) {
    return {
      label: "Good",
      colorClass: "text-primary font-medium",
      bars: [
        "bg-primary",
        "bg-primary",
        "bg-primary",
        "bg-surface-container",
      ],
    };
  }
  return {
    label: "Strong",
    colorClass: "text-secondary font-medium",
    bars: [
      "bg-secondary",
      "bg-secondary",
      "bg-secondary",
      "bg-secondary",
    ],
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("iit_bombay");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  // Check if user is already logged in; redirect by role
  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Read role from profiles to decide destination
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();
          const dest =
            profile?.role === "trainer" || profile?.role === "admin"
              ? "/trainer"
              : "/dashboard";
          router.replace(dest);
          return;
        }
      } catch {
        // Ignore session error on mount
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkSession();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (isSignUp && role === "faculty" && !inviteCode.trim()) {
      setErrorMessage("Please enter your trainer invite code.");
      return;
    }

    startTransition(async () => {
      try {
        if (isSignUp) {
          // Role assignment is done entirely on the server — never trust the client.
          const result = await signUpAction({
            email: email.trim(),
            password,
            fullName: fullName.trim(),
            role,
            college: college || undefined,
            inviteCode: inviteCode.trim() || undefined,
          });

          if (!result.ok) {
            setErrorMessage(result.error);
            return;
          }

          if (result.needsEmailVerification) {
            setSuccessMessage(
              "Account created! Please check your inbox and verify your email before signing in."
            );
            setIsSignUp(false);
          } else {
            // Session is live — redirect by role
            window.location.href =
              result.role === "trainer" ? "/trainer" : "/dashboard";
          }
        } else {
          // Sign-in: server reads the authoritative role from profiles
          const result = await signInAction({
            email: email.trim(),
            password,
          });

          if (!result.ok) {
            setErrorMessage(result.error);
            return;
          }

          window.location.href =
            result.role === "trainer" || result.role === "admin"
              ? "/trainer"
              : "/dashboard";
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      }
    });
  };

  if (isCheckingSession) {
    return (
      <main
        className={`${inter.className} min-h-screen flex items-center justify-center bg-surface px-4`}
      >
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
            progress_activity
          </span>
          <p className="font-body-sm text-body-sm">
            Verifying authentication session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div
      className={`${inter.className} bg-surface font-body-base text-body-base text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed`}
    >
      <main className="flex-1 flex flex-col relative w-full pt-6 pb-8 bg-surface px-margin-sm sm:px-6">
        <div className="flex flex-col w-full pb-8">
          {/* Subtle ambient decorative glow */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Header Section */}
            <header className="flex flex-col items-center text-center mt-2 mb-6 px-2">
              {/* App Brandmark */}
              <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center shadow-md mb-4 text-on-primary">
                <span
                  className="material-symbols-outlined text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  school
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container mb-2 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">
                  verified
                </span>
                <span className="font-label-sm text-label-sm font-semibold">
                  Campus Recruitment 2025
                </span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mb-2 font-bold">
                PlaceReady
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
                Master your campus placements with adaptive mock tests, coding
                drills, and AI interview prep.
              </p>
            </header>

            {/* Main Auth Card Container */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md transition-all duration-300">
              {/* Segmented Auth Mode Switcher */}
              <div
                className="bg-surface-container p-1 rounded-lg flex items-center justify-between mb-6"
                role="tablist"
              >
                <button
                  aria-selected={!isSignUp}
                  className={`flex-1 min-h-[44px] rounded-lg font-label-md text-label-md transition-all flex items-center justify-center cursor-pointer ${
                    !isSignUp
                      ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  id="tabSignIn"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  role="tab"
                  type="button"
                >
                  Sign In
                </button>
                <button
                  aria-selected={isSignUp}
                  className={`flex-1 min-h-[44px] rounded-lg font-label-md text-label-md transition-all flex items-center justify-center cursor-pointer ${
                    isSignUp
                      ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  id="tabSignUp"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  role="tab"
                  type="button"
                >
                  Sign Up
                </button>
              </div>

              {/* Role Selector Switch (Shown in Sign Up mode) */}
              <div className="mb-5">
                <span className="block font-label-sm text-label-sm text-on-surface-variant mb-2 font-medium">
                  I am joining as
                </span>
                <div
                  aria-label="Account Role"
                  className="grid grid-cols-2 gap-2"
                  role="radiogroup"
                >
                  {/* Student Pill */}
                  <button
                    aria-checked={role === "student"}
                    className={`min-h-[44px] px-3 py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === "student"
                        ? "bg-primary-fixed text-on-primary-fixed font-semibold shadow-xs"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                    id="roleStudent"
                    onClick={() => setRole("student")}
                    role="radio"
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      school
                    </span>
                    <span>Student</span>
                  </button>

                  {/* Faculty Pill */}
                  <button
                    aria-checked={role === "faculty"}
                    className={`min-h-[44px] px-3 py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === "faculty"
                        ? "bg-primary-fixed text-on-primary-fixed font-semibold shadow-xs"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                    id="roleFaculty"
                    onClick={() => setRole("faculty")}
                    role="radio"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      co_present
                    </span>
                    <span>Trainer / Faculty</span>
                  </button>
                </div>
              </div>

              {/* Contextual Error Banner */}
              {errorMessage && (
                <div
                  className="bg-error-container text-on-error-container rounded-lg p-3.5 mb-5 flex items-start gap-3 shadow-xs transition-all"
                  id="errorAlert"
                  role="alert"
                >
                  <span className="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5">
                    warning
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-sm text-label-sm text-on-error-container font-semibold">
                      Authentication Error
                    </p>
                    <p className="font-body-sm text-caption text-on-error-container mt-0.5 opacity-90">
                      {errorMessage}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      {isSignUp && (
                        <button
                          className="font-label-sm text-caption text-error font-bold underline underline-offset-2 min-h-[44px] inline-flex items-center cursor-pointer"
                          onClick={() => {
                            setIsSignUp(false);
                            setErrorMessage(null);
                          }}
                          type="button"
                        >
                          Go to Sign In
                        </button>
                      )}
                      <button
                        className="font-label-sm text-caption text-on-surface-variant min-h-[44px] inline-flex items-center ml-auto cursor-pointer"
                        onClick={() => setErrorMessage(null)}
                        type="button"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Contextual Success Banner */}
              {successMessage && (
                <div
                  className="bg-secondary-container/20 border border-secondary/20 text-on-surface rounded-lg p-3.5 mb-5 flex items-start gap-3 shadow-xs transition-all"
                  role="status"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-sm text-label-sm text-secondary font-semibold">
                      Account Registered
                    </p>
                    <p className="font-body-sm text-caption text-on-surface-variant mt-0.5 opacity-90">
                      {successMessage}
                    </p>
                  </div>
                  <button
                    className="font-label-sm text-caption text-on-surface-variant min-h-[44px] inline-flex items-center ml-auto cursor-pointer"
                    onClick={() => setSuccessMessage(null)}
                    type="button"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Registration / Sign In Form */}
              <form className="flex flex-col gap-4" id="authForm" onSubmit={handleSubmit}>
                {/* Full Name Input (Visible in Sign Up mode) */}
                {isSignUp && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-sm text-label-sm text-on-surface font-medium flex items-center justify-between"
                      htmlFor="fullName"
                    >
                      <span>Full Name</span>
                      <span className="text-caption text-on-surface-variant">Required</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[20px]">
                        person
                      </span>
                      <input
                        className="w-full min-h-[44px] h-[44px] pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:shadow-xs transition-all"
                        id="fullName"
                        name="name"
                        placeholder="e.g. Rohan Verma"
                        required={isSignUp}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isPending}
                      />
                    </div>
                  </div>
                )}

                {/* College Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-sm text-label-sm text-on-surface font-medium flex items-center justify-between"
                    htmlFor="collegeEmail"
                  >
                    <span>College Email Address</span>
                    <span className="text-caption text-secondary font-medium">
                      Domain Verified
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[20px]">
                      alternate_email
                    </span>
                    <input
                      className="w-full min-h-[44px] h-[44px] pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:shadow-xs transition-all"
                      id="collegeEmail"
                      name="email"
                      placeholder="rohan.verma@college.edu"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPending}
                    />
                  </div>
                </div>

                {/* College/University Selector (Visible in Sign Up mode) */}
                {isSignUp && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-sm text-label-sm text-on-surface font-medium"
                      htmlFor="collegeSelect"
                    >
                      College / University
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[20px]">
                        apartment
                      </span>
                      <select
                        className="w-full min-h-[44px] h-[44px] pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:shadow-xs transition-all cursor-pointer"
                        id="collegeSelect"
                        name="college"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        disabled={isPending}
                      >
                        <option value="" disabled>
                          Select your registered campus
                        </option>
                        <option value="iit_bombay">
                          Indian Institute of Technology, Bombay
                        </option>
                        <option value="iit_delhi">
                          Indian Institute of Technology, Delhi
                        </option>
                        <option value="bits_pilani">
                          BITS Pilani Campus
                        </option>
                        <option value="nit_trichy">
                          National Institute of Technology, Trichy
                        </option>
                        <option value="other">
                          Other AICTE / UGC Approved Institute
                        </option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 text-on-surface-variant pointer-events-none text-[20px]">
                        unfold_more
                      </span>
                    </div>
                  </div>
                )}

                {/* Trainer Invite Code (visible when role=faculty in Sign Up) */}
                {isSignUp && role === "faculty" && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-sm text-label-sm text-on-surface font-medium flex items-center justify-between"
                      htmlFor="inviteCode"
                    >
                      <span>Trainer Invite Code</span>
                      <span className="text-caption text-error font-medium">Required</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[20px]">
                        key
                      </span>
                      <input
                        className="w-full min-h-[44px] h-[44px] pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:shadow-xs transition-all"
                        id="inviteCode"
                        name="inviteCode"
                        placeholder="Contact your administrator for this code"
                        required
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        disabled={isPending}
                      />
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Trainers are verified by campus administrators. Contact your placement cell if you don&apos;t have a code.
                    </p>
                  </div>
                )}

                {/* Password Field with Show/Hide & Strength Indicator */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-sm text-label-sm text-on-surface font-medium"
                    htmlFor="passwordField"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none text-[20px]">
                      lock
                    </span>
                    <input
                      className="w-full min-h-[44px] h-[44px] pl-10 pr-12 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:shadow-xs transition-all"
                      id="passwordField"
                      name="password"
                      placeholder="Minimum 8 characters"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isPending}
                    />
                    <button
                      aria-label="Toggle password visibility"
                      className="absolute right-1 w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-md focus:outline-none cursor-pointer"
                      id="togglePasswordBtn"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]" id="passwordIcon">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-caption font-caption mb-1">
                        <span className="text-on-surface-variant">Password strength</span>
                        <span className={passwordStrength.colorClass} id="strengthLabel">
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex gap-1">
                        <div
                          className={`h-full flex-1 rounded-full transition-colors duration-300 ${passwordStrength.bars[0]}`}
                          id="bar1"
                        />
                        <div
                          className={`h-full flex-1 rounded-full transition-colors duration-300 ${passwordStrength.bars[1]}`}
                          id="bar2"
                        />
                        <div
                          className={`h-full flex-1 rounded-full transition-colors duration-300 ${passwordStrength.bars[2]}`}
                          id="bar3"
                        />
                        <div
                          className={`h-full flex-1 rounded-full transition-colors duration-300 ${passwordStrength.bars[3]}`}
                          id="bar4"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary CTA Button */}
                <button
                  className="w-full min-h-[48px] h-12 mt-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-md active:scale-[0.99] hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  id="submitCta"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        progress_activity
                      </span>
                      <span>
                        {isSignUp ? "Creating Account..." : "Signing In..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span id="ctaText">
                        {isSignUp
                          ? role === "student"
                            ? "Create Student Account"
                            : "Create Faculty Account"
                          : "Sign In to Dashboard"}
                      </span>
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Soft Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-grow h-px bg-surface-container" />
                <span className="flex-shrink mx-3 text-caption font-caption text-on-surface-variant">
                  or continue with
                </span>
                <div className="flex-grow h-px bg-surface-container" />
              </div>

              {/* SSO Secondary Option */}
              <button
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md shadow-xs hover:bg-surface-container active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
                type="button"
                onClick={() => {
                  setErrorMessage(
                    "College SSO integration is managed by your campus administrator. Please sign in with your email."
                  );
                }}
              >
                <span className="material-symbols-outlined text-primary text-[20px]">
                  corporate_fare
                </span>
                <span>Continue with College SSO</span>
              </button>

              {/* Quick Switch */}
              <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-5">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
                  className="text-primary font-label-md text-label-md underline underline-offset-4 ml-1 min-h-[44px] inline-flex items-center cursor-pointer font-medium"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  type="button"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>

              {/* Terms & Privacy Footnote */}
              <p className="text-center font-caption text-caption text-on-surface-variant/80 mt-4 leading-normal">
                By continuing, you agree to PlaceReady&apos;s{" "}
                <a className="text-on-surface underline" href="#">
                  Placement Code of Conduct
                </a>{" "}
                and{" "}
                <a className="text-on-surface underline" href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Campus Placement Live Pulse Banner */}
            <div className="mt-6 mx-2 p-4 rounded-xl bg-surface-container-low flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  insights
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-label-sm text-label-sm text-on-surface truncate font-semibold">
                  Upcoming Placement Season
                </h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  Over 1,420+ company drives mapped this semester.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
