"use client";

import { useSession } from "next-auth/react";
import LoginButton from "@/components/auth/LoginButton";
import UserMenu from "@/components/auth/UserMenu";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="relative flex h-16 items-center justify-between bg-gradient-to-r from-dune-dark-900/95 via-dune-dark-950 to-dune-dark-900/95 px-5 shadow-lg shadow-black/30 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="group cursor-default select-none">
          <h1 className="text-glow font-[family-name:var(--font-cinzel)] text-xl font-bold tracking-wide">
            <span className="bg-gradient-to-r from-dune-sand-300 via-dune-spice-400 to-dune-sand-300 bg-clip-text text-transparent">
              HOLIDY SPICE
            </span>
          </h1>
          <p className="font-[family-name:var(--font-cinzel)] -mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-dune-sand-500/60">
            Deep Desert Map
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {session ? <UserMenu /> : <LoginButton />}
      </div>

      {/* Bottom accent glow line */}
      <div className="glow-line absolute bottom-0 left-0 right-0" />
    </header>
  );
}
