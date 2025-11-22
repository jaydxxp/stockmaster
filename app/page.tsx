import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />


      <div className="flex justify-center flex-col min-h-screen items-center gap-3 relative z-10">
        <div className="text-center text-6xl">
          Reimagine <span className="italic instrument">Inventory</span>
          <br />
          <span className="font-bold">Simple, Smart, and Scalable.</span>
        </div>

        <p className="text-gray-500 text-center text-sm">
          A powerful SaaS solution that simplifies inventory tracking, reduces
          errors,<br /> and keeps your business running smoothly.
        </p>
        <div className="flex gap-3">
  {/* Get Started Button */}
  <Link href={"/login"} >
  <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-900 transition">
    Get Started
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 3l6 5-6 5" /> 
    </svg>
  </button>
  </Link>

  {/* Demo Button */}
  <button className="flex items-center gap-2 bg-gray-100 text-black px-6 py-3 rounded-full hover:bg-gray-200 transition">
    Demo
    <svg
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  </button>
</div>

      </div>
    </div>
  );
}
