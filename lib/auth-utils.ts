
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function getUserId(): Promise<number> {
  const session = await getSession();
  return Number(session.user.id);
}


export async function requireRole(role: string) {
  const session = await getSession();
  if (session.user.role !== role) {
    throw new Error("Unauthorized");
  }
  return session;
}


export async function requireAdmin() {
  return requireRole("ADMIN");
}



export async function getOptionalSession() {
  return await auth();
}
