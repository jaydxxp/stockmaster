"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ForgotPassword() {
  const params = useSearchParams();
  const emailFromQuery = params.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [step, setStep] = useState<"EMAIL" | "OTP" | "RESET">("EMAIL");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);


  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }


    if (newOtp.every((d) => d !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleOtpBackspace = (index: number, value: string) => {
    if (value === "" && index > 0) {
      (document.getElementById(`otp-${index - 1}`) as HTMLInputElement)?.focus();
    }
  };

  
  const verifyOtp = async (code: string) => {
    console.log("Verifying OTP:", code);

    
    await new Promise((r) => setTimeout(r, 700));

    if (code === "111111") {
      setStep("RESET");
      setError("");
    } else {
      setError("Invalid OTP. Try again.");
      setOtp(Array(6).fill(""));
      (document.getElementById("otp-0") as HTMLInputElement)?.focus();
    }
  };

  return (
    <div className="pt-40 px-4">
      <Navbar />

      <div className="flex min-h-[70vh] flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        
        <h2 className="text-center text-3xl font-bold text-black">
          Forgot Password
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          {step === "EMAIL" && "Enter your email to receive OTP"}
          {step === "OTP" && "Enter the 6-digit OTP sent to your email"}
          {step === "RESET" && "Enter your new password"}
        </p>

      
        {step === "EMAIL" && (
          <form
            className="mt-10 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return alert("Enter email");
              setStep("OTP");
              setTimeout(() => {
                (document.getElementById("otp-0") as HTMLInputElement)?.focus();
              }, 200);
            }}
          >
            <div>
              <label className="text-sm font-medium text-black">Email</label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="
                  mt-2 block w-full rounded-xl 
                  border border-black/20 
                  bg-white px-4 py-2.5 
                  text-black text-sm
                  placeholder:text-gray-400 
                  focus:border-black focus:outline-none transition
                "
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              className="
                w-full rounded-xl bg-black text-white
                py-2.5 text-sm font-semibold 
                hover:bg-black/80 transition
              "
            >
              Send OTP
            </button>
          </form>
        )}

       
        {step === "OTP" && (
          <div className="mt-10">
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
            <div className="mt-10 flex justify-between gap-3">
              {[0, 1, 2, 3].map((i) => (
                
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      handleOtpBackspace(i, (e.target as HTMLInputElement).value);
                    }
                  }}
                  className="
                    w-12 h-14 rounded-xl border border-black/20 
                    text-center text-xl font-semibold text-black
                    focus:border-black focus:outline-none transition
                  "
                />
              ))}
            </div>

            {error && (
              <p className="text-red-600 text-center mt-4 text-sm">{error}</p>
            )}
          </div>
        )}

    
        {step === "RESET" && (
          <form
            className="mt-10 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Password updated!");
            }}
          >
          
            <div>
              <label className="text-sm font-medium text-black">
                New Password
              </label>
              <input
                type="password"
                required
                className="
                  mt-2 block w-full rounded-xl 
                  border border-black/20 
                  bg-white px-4 py-2.5 text-black text-sm
                  placeholder:text-gray-400 
                  focus:border-black focus:outline-none transition
                "
                placeholder="••••••••"
              />
            </div>

   
            <div>
              <label className="text-sm font-medium text-black">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                className="
                  mt-2 block w-full rounded-xl 
                  border border-black/20 
                  bg-white px-4 py-2.5 text-black text-sm
                  placeholder:text-gray-400 
                  focus:border-black focus:outline-none transition
                "
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="
                w-full rounded-xl bg-black text-white
                py-2.5 text-sm font-semibold 
                hover:bg-black/80 transition
              "
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
