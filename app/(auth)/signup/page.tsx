"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Signup() {
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

        <form className="mt-10 space-y-4">
     
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              LoginID
            </label>

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
              placeholder="Enter Unique LoginID"
            />
          </div>
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

        
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>

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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Re-Enter Password
            </label>

            <input
              id="re-enterpassword"
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
            Sign Up
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
