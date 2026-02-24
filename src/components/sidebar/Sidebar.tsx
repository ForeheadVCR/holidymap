"use client";

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
}: SidebarProps) {
  const groups = Object.entries(CATEGORY_GROUPS) as [CategoryGroup, typeof CATEGORY_GROUPS[CategoryGroup]][];

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

      {/* Right edge glow divider */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-dune-spice-600/20 to-transparent" />
    </aside>
  );
}
