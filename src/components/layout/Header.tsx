"use client";

import { useSession } from "next-auth/react";
import LoginButton from "@/components/auth/LoginButton";
import UserMenu from "@/components/auth/UserMenu";
import RegionTabs from "@/components/sidebar/RegionTabs";
import { Map } from "lucide-react";

interface HeaderProps {
  activeRegion: string;
  onRegionChange: (region: string) => void;
}

export default function Header({ activeRegion, onRegionChange }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-dune-dark-700 bg-dune-dark-900 px-4">
      <div className="flex items-center gap-3">
        <Map className="h-6 w-6 text-dune-spice-500" />
        <h1 className="text-lg font-bold tracking-wide text-gray-100">
          <span className="text-dune-spice-500">Holidy</span>Map
        </h1>
      </div>

      <RegionTabs activeRegion={activeRegion} onRegionChange={onRegionChange} />

      <div className="flex items-center gap-3">
        {session ? <UserMenu /> : <LoginButton />}
      </div>
    </header>
  );
}
