"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res: any = await signIn("credentials", {
      redirect: false,
      loginId,
      password,
    });

    setIsSubmitting(false);

    if (res?.error) {
      setError(res.error || "Invalid credentials");
      return;
    }


    router.push("/dashboard");
  };

  const goToForgot = () => {
    router.push(`/forgot-password?email=${encodeURIComponent(loginId)}`);
  };

  return (
    <div className="pt-40 px-4">
      <Navbar />

      <div className="flex min-h-[70vh] flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-3xl font-bold tracking-tight text-black">
          Welcome Back
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          Login to your account
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-black">LoginID</label>
            <input
              id="loginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              type="text"
              className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black"
              placeholder="your login id"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">Password</label>

              <button
                type="button"
                onClick={goToForgot}
                className="text-sm font-medium text-black/60 hover:text-black transition"
              >
                Forgot Password?
              </button>
            </div>

            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-black/80 transition disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-black underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
