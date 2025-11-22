"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ForgotPassword() {
  const params = useSearchParams();
  const router = useRouter();
  const emailFromQuery = params.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [step, setStep] = useState<"EMAIL" | "OTP" | "RESET">("EMAIL");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const firstOtpRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const focusInput = (index: number) => {
    (document.getElementById(`otp-${index}`) as HTMLInputElement | null)?.focus();
  };

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!email) return setError("Enter email");

    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed (${res.status})`);
      }
      setStep("OTP");
      setTimeout(() => focusInput(0), 200);
      setSuccessMsg("OTP sent to your email");
    } catch (err: any) {
      console.error("Send OTP failed:", err);
      setError(err?.message ?? "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < otp.length - 1) {
      focusInput(index + 1);
    }

    // if all filled, move to RESET step so user can set new password
    if (newOtp.every((d) => d !== "")) {
      setTimeout(() => {
        setStep("RESET");
        setTimeout(() => newPasswordRef.current?.focus(), 100);
      }, 150);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const val = (e.target as HTMLInputElement).value;
    if (e.key === "Backspace") {
      if (val === "" && index > 0) {
        focusInput(index - 1);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      focusInput(index + 1);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otp.length);
    if (!pasted) return;
    const newOtp = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    if (newOtp.every((d) => d !== "")) {
      setTimeout(() => {
        setStep("RESET");
        setTimeout(() => newPasswordRef.current?.focus(), 100);
      }, 150);
    } else {
      const firstEmpty = newOtp.findIndex((d) => d === "");
      if (firstEmpty >= 0) focusInput(firstEmpty);
    }
  };

  const handleResetSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setSuccessMsg("");

    const code = otp.join("");
    if (!email) return setError("Email is required");
    if (!code || code.length !== 6) return setError("Enter the 6-digit OTP");
    const form = e?.target as HTMLFormElement | null;
    const formData = form ? new FormData(form) : null;
    const newPassword = formData?.get("newPassword") as string | null;
    const confirmPassword = formData?.get("confirmPassword") as string | null;
    if (!newPassword) return setError("Enter new password");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");

    setIsSubmittingReset(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, newPassword }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed (${res.status})`);
      }
      setSuccessMsg("Password updated. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      console.error("Reset failed:", err);
      setError(err?.message ?? "Failed to reset password");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  return (
    <div className="pt-40 px-4">
      <Navbar />

      <div className="flex min-h-[70vh] flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-3xl font-bold text-black">Forgot Password</h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          {step === "EMAIL" && "Enter your email to receive OTP"}
          {step === "OTP" && "Enter the 6-digit OTP sent to your email"}
          {step === "RESET" && "Enter your new password"}
        </p>

        {step === "EMAIL" && (
          <form className="mt-10 space-y-6" onSubmit={sendOtp}>
            <div>
              <label className="text-sm font-medium text-black">Email</label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black focus:outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-black/80 transition disabled:opacity-60"
            >
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "OTP" && (
          <div className="mt-10 flex flex-col items-center">
            <div className="flex gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  ref={i === 0 ? firstOtpRef : undefined}
                  value={digit}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(e as any, i)}
                  onPaste={handleOtpPaste}
                  className="w-12 h-14 rounded-xl border border-black/20 text-center text-xl font-semibold text-black focus:border-black focus:outline-none transition"
                />
              ))}
            </div>

            {error && <p className="text-red-600 text-center mt-4 text-sm">{error}</p>}
            {successMsg && <p className="text-green-600 text-center mt-2 text-sm">{successMsg}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setOtp(Array(6).fill(""));
                  setStep("EMAIL");
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Change Email
              </button>
              <button
                onClick={() => {
                  setOtp(Array(6).fill(""));
                  setTimeout(() => focusInput(0), 50);
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {step === "RESET" && (
          <form className="mt-10 space-y-6" onSubmit={handleResetSubmit}>
            <div>
              <label className="text-sm font-medium text-black">New Password</label>
              <input
                name="newPassword"
                type="password"
                ref={newPasswordRef}
                required
                className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-black text-sm placeholder:text-gray-400 focus:border-black focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep("OTP");
                  setTimeout(() => focusInput(0), 50);
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmittingReset}
                className="w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:bg-black/80 transition disabled:opacity-60"
              >
                {isSubmittingReset ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
