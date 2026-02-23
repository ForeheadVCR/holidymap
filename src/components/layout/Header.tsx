"use client";

import { useSession } from "next-auth/react";
import LoginButton from "@/components/auth/LoginButton";
import UserMenu from "@/components/auth/UserMenu";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-dune-dark-700 bg-dune-dark-900 px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold tracking-wide text-gray-100">
          <span className="text-dune-spice-500">Holidy Spice</span> Deep Desert Map
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {session ? <UserMenu /> : <LoginButton />}
      </div>
    </header>
  );
}
