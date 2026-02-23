"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryData } from "@/types/pin";

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
    <div className="mb-2">
      <div className="flex items-center justify-between py-1.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-200"
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
            "flex h-5 w-5 items-center justify-center rounded",
            isGroupEnabled
              ? "text-white"
              : isGroupPartial
              ? "text-gray-400"
              : "text-gray-600"
          )}
          style={{
            backgroundColor: isGroupEnabled ? color : isGroupPartial ? `${color}66` : undefined,
          }}
          title={isGroupEnabled ? "Hide all" : "Show all"}
        >
          <Minus className="h-3 w-3" />
        </button>
      </div>

      {expanded && (
        <div className="space-y-0.5 pl-1">
          {categories.map((cat) => {
            const enabled = allEnabled || enabledCategories.has(cat.slug);
            return (
              <button
                key={cat.slug}
                onClick={() => onToggleCategory(cat.slug)}
                className={cn(
                  "flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors",
                  enabled
                    ? "text-gray-200 hover:bg-dune-dark-800"
                    : "text-gray-500 hover:bg-dune-dark-800 hover:text-gray-400"
                )}
              >
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: enabled ? cat.color : `${cat.color}44`,
                  }}
                />
                <span className={cn(!enabled && "line-through decoration-gray-600")}>
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
