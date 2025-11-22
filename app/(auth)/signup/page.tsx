"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function Signup() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/auth/signup", {
        loginId,
        name,
        email,
        password,
      });

      if (res.data?.success) {
        // sign in via next-auth credentials provider (no redirect)
        const signInRes: any = await signIn("credentials", {
          redirect: false,
          loginId,
          password,
        });

        if (signInRes?.error) {
          setError(signInRes.error || "Signed up but sign-in failed");
        } else {
          router.push("/");
        }
      } else {
        setError(res.data?.error || "Signup failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-40 px-4">
      <Navbar />

      <div className="flex min-h-[70vh] flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-3xl font-bold tracking-tight text-black">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join us and get started today
        </p>

        <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="loginId" className="block text-sm font-medium text-black">
              LoginID
            </label>
            <input
              id="loginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              type="text"
              required
              className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black focus:outline-none transition"
              placeholder="Enter Unique LoginID"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black focus:outline-none transition"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="re-enterpassword" className="block text-sm font-medium text-black">
              Re-Enter Password
            </label>
            <input
              id="re-enterpassword"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              type="password"
              required
              className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-black/80 transition disabled:opacity-60"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-black underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
