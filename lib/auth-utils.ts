// lib/auth-utils.ts
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session or redirect to login
 */
export async function getSession() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/**
 * Get the numeric user ID from session
 */
export async function getUserId(): Promise<number> {
  const session = await getSession();
  return Number(session.user.id);
}

/**
 * Check if user has a specific role
 */
export async function requireRole(role: string) {
  const session = await getSession();
  if (session.user.role !== role) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Check if user is admin
 */
export async function requireAdmin() {
  return requireRole("ADMIN");
}

/**
 * Get session without redirecting (returns null if not authenticated)
 */
export async function getOptionalSession() {
  return await auth();
}
