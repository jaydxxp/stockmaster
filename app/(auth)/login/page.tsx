"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Login() {
  return (
    <div className="pt-40 px-4">
      <Navbar />

      <div className="flex min-h-[70vh] flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Title */}
        <h2 className="text-center text-3xl font-bold tracking-tight text-black">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Login to your account
        </p>

        {/* Form */}
        <form className="mt-10 space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="
                mt-2 block w-full rounded-xl 
                border border-black/20 
                bg-white px-4 py-2.5 
                text-black text-sm
                placeholder:text-gray-400 
                focus:border-black focus:outline-none
                transition
              "
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>

              <Link href="/forgot-password" className="text-sm font-medium text-black/60 hover:text-black transition">
                Forgot Password?
              </Link>
            </div>

            <input
              id="password"
              type="password"
              required
              className="
                mt-2 block w-full rounded-xl 
                border border-black/20 
                bg-white px-4 py-2.5 
                text-black text-sm
                placeholder:text-gray-400
                focus:border-black focus:outline-none
                transition
              "
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full rounded-xl 
              bg-black text-white 
              py-2.5 text-sm font-semibold 
              hover:bg-black/80 
              transition
            "
          >
            Sign In
          </button>
        </form>

        {/* Signup link */}
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
