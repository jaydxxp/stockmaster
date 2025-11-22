"use client";

import { useEffect, useRef, useState } from "react";
import DashboardSidebar from "@/components/Sidebar";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="flex min-h-screen bg-white text-black">
     
      <DashboardSidebar />


      <div className="flex-1 p-10 relative">
        

        <div className="flex justify-end mb-10">
          <div
            ref={menuRef}
            className="relative"
          >
      
            <div
              onClick={() => setOpen(!open)}
              className="
                w-12 h-12 rounded-full bg-black text-white flex 
                items-center justify-center cursor-pointer 
                hover:opacity-80 transition relative
              "
            >
              <span className="font-bold">S</span>
            </div>

           
            {open && (
              <div
                className="
                  absolute right-0 mt-3 w-48 
                  bg-white border border-black/10 shadow-xl
                  rounded-xl py-2 z-50 animate-fadeIn
                "
              >
                <button
                  className="
                    w-full text-left px-4 py-2 text-sm 
                    hover:bg-black/5 transition
                  "
                >
                  Profile
                </button>

                <button
                  className="
                    w-full text-left px-4 py-2 text-sm 
                    hover:bg-black/5 transition
                  "
                >
                  Settings
                </button>

                <div className="border-t border-black/10 my-2" />
<Link href={"/"}>
                <button
                  
                  className="
                    w-full text-left px-4 py-2 text-sm text-red-600 
                    hover:bg-red-50 transition
                  "
                >
                  Logout
                </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
