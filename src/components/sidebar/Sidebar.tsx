"use client";

import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import RegionTabs from "./RegionTabs";
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
}: SidebarProps) {
  const groups = Object.entries(CATEGORY_GROUPS) as [CategoryGroup, typeof CATEGORY_GROUPS[CategoryGroup]][];

  return (
    <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-dune-dark-700 bg-dune-dark-900 md:flex">
      {/* Mobile region tabs (shown on md only in sidebar) */}
      <div className="border-b border-dune-dark-700 p-3 md:hidden">
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
    </aside>
  );
}
