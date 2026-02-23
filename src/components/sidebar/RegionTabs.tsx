"use client";

import { cn } from "@/lib/utils";
import { REGIONS } from "@/lib/categories";

interface RegionTabsProps {
  activeRegion: string;
  onRegionChange: (region: string) => void;
}

export default function RegionTabs({
  activeRegion,
  onRegionChange,
}: RegionTabsProps) {
  return (
    <div className="hidden items-center gap-1 md:flex">
      {REGIONS.map((region) => (
        <button
          key={region.slug}
          onClick={() => onRegionChange(region.slug)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            activeRegion === region.slug
              ? "bg-dune-spice-500 text-white"
              : "text-gray-400 hover:bg-dune-dark-800 hover:text-gray-200"
          )}
        >
          {region.name}
        </button>
      ))}
    </div>
  );
}
