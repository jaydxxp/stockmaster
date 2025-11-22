"use client"
import Link from "next/link";

export default function Navbar() {
  return (
    <div
      className="
        flex justify-between items-center
        fixed top-6 left-1/2 -translate-x-1/2
        px-8 py-4
        bg-white/40 backdrop-blur-xl
        rounded-4xl shadow-lg
        w-[85%] max-w-5xl
        animate-fadeIn
        z-50
      "
    >
      {/* LEFT — Brand */}
      <div className="flex items-center gap-2 font-bold text-xl">
        <Link href="/" className="text-black">
          Stockmaster
        </Link>
      </div>

      {/* CENTER — Navigation */}
      <div className="flex gap-8 text-black/70 font-medium">
        <Link href="/" className="hover:text-black transition">
          Home
        </Link>
        <Link href="/features" className="hover:text-black transition">
          Features
        </Link>
        <Link href="/services" className="hover:text-black transition">
          Services
        </Link>
        <Link href="/contact" className="hover:text-black transition">
          Contact
        </Link>
      </div>

      {/* RIGHT — Buttons */}
      <div className="flex gap-3">
        <Link href="/login">
          <button
            className="
              px-4 py-2 rounded-full
              bg-transparent border border-black/30
              text-black hover:bg-black/10 transition
            "
          >
            Login
          </button>
        </Link>

        <Link href="/signup">
          <button
            className="
              px-4 py-2 rounded-full
              bg-black text-white
              hover:bg-gray-900 transition
            "
          >
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
}
