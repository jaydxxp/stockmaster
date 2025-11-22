"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Login() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);

  const goToForgot = () => {
    const emailValue = emailRef.current?.value || "";

    
    router.push(`/forgot-password?email=${encodeURIComponent(emailValue)}`);
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

        <form className="mt-10 space-y-6">
      
          <div>
            <label className="text-sm font-medium text-black">LoginID</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              className="
                mt-2 block w-full rounded-xl 
                border border-black/20 
                bg-white px-4 py-2.5 
                text-black text-sm
                placeholder:text-gray-400 
                focus:border-black
              "
              placeholder="you@example.com"
            />
          </div>

         
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">
                Password
              </label>

        
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
              type="password"
              className="
                mt-2 block w-full rounded-xl 
                border border-black/20 bg-white
                px-4 py-2.5 text-black text-sm
                placeholder:text-gray-400
                focus:border-black
              "
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-black/80 transition"
          >
            Sign In
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
