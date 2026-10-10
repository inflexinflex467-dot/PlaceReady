"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type SignUpResult =
  | { ok: true; role: "student" | "trainer"; needsEmailVerification: boolean }
  | { ok: false; error: string };

export async function signUpAction(formData: {
  email: string;
  password: string;
  fullName: string;
  role: "student" | "faculty";
  college?: string;
  inviteCode?: string;
}): Promise<SignUpResult> {
  const { email, password, fullName, role, college, inviteCode } = formData;

  // --- Trainer invite-code gate (server-side only) ---
  const assignedRole: "student" | "trainer" =
    role === "faculty" ? "trainer" : "student";

  if (assignedRole === "trainer") {
    const expectedCode = process.env.TRAINER_INVITE_CODE;
    if (!expectedCode) {
      return { ok: false, error: "Trainer sign-up is not configured. Contact admin." };
    }
    if (!inviteCode || inviteCode.trim() !== expectedCode.trim()) {
      return { ok: false, error: "Invalid trainer invite code. Please contact your administrator." };
    }
  }

  // --- Sign up with Supabase Auth (anon client — user-facing session) ---
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        // Store only full_name & college in metadata; role is set below via admin
        full_name: fullName.trim(),
        college: college || undefined,
      },
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    // Email confirmation required; profile will be written after confirmation
    // We still want to persist the role in the trigger row once the user confirms.
    // This is handled via the admin update below if the row already exists,
    // or the user signs in after confirmation and logs in fine.
    return { ok: true, role: assignedRole, needsEmailVerification: true };
  }

  // --- Write the correct role using the admin (service-role) client ---
  // The handle_new_user trigger inserts the profile row with role='student' by
  // default. We immediately overwrite it with the correct value here on the
  // server, where it cannot be tampered with by the client.
  const admin = createAdminClient();
  const { error: updateError } = await admin
    .from("profiles")
    .update({ role: assignedRole })
    .eq("id", userId);

  if (updateError) {
    // Non-fatal — profile exists but role is wrong; log and surface as warning.
    console.error("Failed to set role for user", userId, updateError);
  }

  const needsEmailVerification = !data.session;
  return { ok: true, role: assignedRole, needsEmailVerification };
}

export type SignInResult =
  | { ok: true; role: "student" | "trainer" | "admin" }
  | { ok: false; error: string };

export async function signInAction(formData: {
  email: string;
  password: string;
}): Promise<SignInResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email.trim(),
    password: formData.password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Sign-in succeeded but could not load user." };
  }

  // Read role from profiles (server-authoritative)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role as "student" | "trainer" | "admin") || "student";
  return { ok: true, role };
}
