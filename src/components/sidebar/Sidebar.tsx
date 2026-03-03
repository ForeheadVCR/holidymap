"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import RegionTabs from "./RegionTabs";
import ActivityLog from "./ActivityLog";
import { CategoryData } from "@/types/pin";
import { CATEGORY_GROUPS, type CategoryGroup } from "@/lib/categories";

interface SidebarProps {
  categories: CategoryData[];
  enabledCategories: Set<string>;
  onToggleCategory: (slug: string) => void;
  onToggleGroup: (group: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeRegion: string;
  onRegionChange: (region: string) => void;
  isAdmin?: boolean;
  onMapWiped?: () => void;
}

export default function Sidebar({
  categories,
  enabledCategories,
  onToggleCategory,
  onToggleGroup,
  searchQuery,
  onSearchChange,
  activeRegion,
  onRegionChange,
  isAdmin,
  onMapWiped,
}: SidebarProps) {
  const groups = Object.entries(CATEGORY_GROUPS) as [CategoryGroup, typeof CATEGORY_GROUPS[CategoryGroup]][];
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [wipePassword, setWipePassword] = useState("");
  const [wipeError, setWipeError] = useState("");
  const [wiping, setWiping] = useState(false);

  const handleWipeMap = async () => {
    setWipeError("");
    setWiping(true);
    try {
      const res = await fetch("/api/admin/wipe-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: wipePassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setWipeError(data.error || "Wipe failed");
        return;
      }
      setShowWipeModal(false);
      setWipePassword("");
      onMapWiped?.();
    } catch {
      setWipeError("Network error");
    } finally {
      setWiping(false);
    }
  };

  return (
    <aside className="relative hidden w-72 flex-shrink-0 flex-col bg-gradient-to-b from-dune-dark-900 to-dune-dark-950 md:flex">
      {/* Mobile region tabs (shown on md only in sidebar) */}
      <div className="border-b border-dune-dark-700/50 p-3 md:hidden">
        <RegionTabs activeRegion={activeRegion} onRegionChange={onRegionChange} />
      </div>

      <div className="p-3">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {groups.map(([groupKey, groupInfo]) => {
          const groupCategories = categories.filter((c) => c.group === groupKey);
          if (groupCategories.length === 0) return null;

          return (
            <CategoryFilter
              key={groupKey}
              group={groupKey}
              label={groupInfo.label}
              color={groupInfo.color}
              categories={groupCategories}
              enabledCategories={enabledCategories}
              onToggleCategory={onToggleCategory}
              onToggleGroup={() => onToggleGroup(groupKey)}
            />
          );
        })}
      </div>

      {isAdmin && <ActivityLog activeRegion={activeRegion} />}

      {isAdmin && (
        <div className="border-t border-dune-dark-700/50 p-3">
          <button
            onClick={() => setShowWipeModal(true)}
            className="w-full rounded bg-red-900/60 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-800/80"
          >
            Wipe All Pins
          </button>
        </div>
      )}

      {showWipeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <div className="w-80 rounded-lg bg-dune-dark-900 border border-dune-dark-700 p-5 shadow-xl">
            <h3 className="text-lg font-bold text-red-400 mb-2">Wipe All Pins</h3>
            <p className="text-sm text-dune-dark-300 mb-4">
              This will permanently delete all pins, votes, and activity logs. Enter the admin password to confirm.
            </p>
            <input
              type="password"
              placeholder="Admin password"
              value={wipePassword}
              onChange={(e) => setWipePassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleWipeMap()}
              className="w-full rounded border border-dune-dark-600 bg-dune-dark-800 px-3 py-2 text-sm text-white placeholder-dune-dark-400 focus:border-red-500 focus:outline-none mb-3"
            />
            {wipeError && (
              <p className="text-xs text-red-400 mb-3">{wipeError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowWipeModal(false);
                  setWipePassword("");
                  setWipeError("");
                }}
                className="flex-1 rounded bg-dune-dark-700 px-3 py-2 text-sm text-dune-dark-300 hover:bg-dune-dark-600"
              >
                Cancel
              </button>
              <button
                onClick={handleWipeMap}
                disabled={wiping || !wipePassword}
                className="flex-1 rounded bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {wiping ? "Wiping..." : "Confirm Wipe"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right edge glow divider */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-dune-spice-600/20 to-transparent" />
    </aside>
  );
}
