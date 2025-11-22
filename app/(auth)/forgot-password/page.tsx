"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const otpRefs = useRef<HTMLInputElement[]>([]);

  // Handle OTP change
  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    otpRefs.current[index]!.value = value;

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace movement
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const target = otpRefs.current[index];

    // BACKSPACE behavior
    if (e.key === "Backspace") {
      if (target?.value === "") {
        if (index > 0) otpRefs.current[index - 1]?.focus();
      } else {
        target.value = "";
      }
    }

    // ARROW navigation
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="pt-40 px-4">
      <Navbar />

      <div className="flex min-h-[70vh] flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">

        {/* STEP 1 — EMAIL INPUT */}
        {step === "email" && (
          <>
            <h2 className="text-center text-3xl font-bold tracking-tight text-black">
              Forgot Password
            </h2>

            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your <span className="font-medium">registered email</span> to receive a 4-digit OTP.
            </p>

            <form className="mt-10 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Registered Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    mt-2 block w-full rounded-xl 
                    border border-black/20 
                    bg-white px-4 py-2.5 
                    text-black text-sm
                    placeholder:text-gray-400 
                    focus:border-black focus:outline-none
                    transition
                  "
                  placeholder="Enter your registered email"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep("otp")}
                className="
                  w-full rounded-xl 
                  bg-black text-white 
                  py-2.5 text-sm font-semibold 
                  hover:bg-black/80 
                  transition
                "
              >
                Send OTP
              </button>
            </form>
          </>
        )}

        {/* STEP 2 — OTP SCREEN */}
        {step === "otp" && (
          <>
            <h2 className="text-center text-3xl font-bold tracking-tight text-black">
              Enter OTP
            </h2>

            <p className="mt-2 text-center text-sm text-gray-600">
              A 4-digit OTP has been sent to <span className="font-medium">{email}</span>
            </p>

            <div className="mt-10 flex justify-between gap-3">
              {[0, 1, 2, 3].map((i) => (
                
                <input
                  key={i}
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  className="
                    w-16 h-16 text-center text-2xl 
                    border border-black/20 
                    rounded-xl
                    bg-white text-black 
                    focus:border-black focus:outline-none
                    transition
                  "
                  ref={(el) => {if(el) otpRefs.current[i] = el}}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                />
              ))}
            </div>

            <button
              type="button"
              className="
                mt-8 w-full rounded-xl 
                bg-black text-white 
                py-2.5 text-sm font-semibold 
                hover:bg-black/80 
                transition
              "
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
