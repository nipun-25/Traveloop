"use server";

import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
} from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResult } from "@/types";

/**
 * Log in a user with email and password
 */
export async function login(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
  return { success: true };
}

/**
 * Sign up a new user
 */
export async function signup(formData: FormData): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const result = signupSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

/**
 * Log out the current user
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
  return { success: true };
}

/**
 * Send password reset email
 */
export async function forgotPassword(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string;

  const result = forgotPasswordSchema.safeParse({ email });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/profile`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}
