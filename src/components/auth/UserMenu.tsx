"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-dune-dark-700/80 bg-dune-dark-900/80 px-3 py-1.5 text-sm transition-all hover:border-dune-dark-600 hover:bg-dune-dark-800"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={24}
            height={24}
            className="rounded-full ring-2 ring-dune-spice-500/30"
          />
        ) : (
          <User className="h-5 w-5 text-gray-400" />
        )}
        <span className="max-w-[120px] truncate text-gray-200">
          {session.user.name}
        </span>
      </button>

      {open && (
        <div className="animate-dropdown-in absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-dune-dark-700/80 bg-dune-dark-900/95 py-1 shadow-2xl shadow-black/40 backdrop-blur-md">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-gray-300 transition-all hover:bg-dune-dark-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
