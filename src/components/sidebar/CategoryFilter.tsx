"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryData } from "@/types/pin";
import { getCategoryIconUrl } from "@/lib/icon-map";

interface CategoryFilterProps {
  group: string;
  label: string;
  color: string;
  categories: CategoryData[];
  enabledCategories: Set<string>;
  onToggleCategory: (slug: string) => void;
  onToggleGroup: () => void;
}

export default function CategoryFilter({
  group,
  label,
  color,
  categories,
  enabledCategories,
  onToggleCategory,
  onToggleGroup,
}: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(true);
  const allEnabled = enabledCategories.has("all");

  const isGroupEnabled = allEnabled || categories.every((c) => enabledCategories.has(c.slug));
  const isGroupPartial =
    !allEnabled &&
    !isGroupEnabled &&
    categories.some((c) => enabledCategories.has(c.slug));

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between py-1.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 border-l-2 border-dune-spice-500/30 pl-2 text-xs font-semibold uppercase tracking-wider text-dune-sand-400/80 transition-colors hover:text-dune-sand-300"
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          {label}
        </button>

        <button
          onClick={onToggleGroup}
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded transition-all",
            isGroupEnabled
              ? "text-white shadow-sm"
              : isGroupPartial
              ? "text-gray-400"
              : "text-gray-600 hover:text-gray-500"
          )}
          style={{
            backgroundColor: isGroupEnabled ? color : isGroupPartial ? `${color}66` : undefined,
            boxShadow: isGroupEnabled ? `0 0 8px ${color}40` : undefined,
          }}
          title={isGroupEnabled ? "Hide all" : "Show all"}
        >
          <Minus className="h-3 w-3" />
        </button>
      </div>

      {expanded && (
        <div className="space-y-0.5 pl-2">
          {categories.map((cat) => {
            const enabled = allEnabled || enabledCategories.has(cat.slug);
            return (
              <button
                key={cat.slug}
                onClick={() => onToggleCategory(cat.slug)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md border-l-2 px-2 py-1.5 text-left text-sm transition-all",
                  enabled
                    ? "border-transparent text-gray-200 hover:border-dune-spice-500/50 hover:bg-dune-dark-800/70"
                    : "border-transparent text-gray-500 hover:border-dune-dark-600 hover:bg-dune-dark-800/50 hover:text-gray-400"
                )}
              >
                <img
                  src={getCategoryIconUrl(cat.slug)}
                  alt=""
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-opacity",
                    !enabled && "opacity-30"
                  )}
                />
                <span className={cn(!enabled && "line-through decoration-gray-600/50")}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
