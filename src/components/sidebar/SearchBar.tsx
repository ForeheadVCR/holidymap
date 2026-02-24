"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Search categories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-dune-dark-700/80 bg-dune-dark-800 py-2 pl-9 pr-8 text-sm text-gray-200 shadow-inner shadow-black/20 placeholder-gray-500 outline-none transition-all focus:border-dune-spice-500/70 focus:ring-2 focus:ring-dune-spice-500/20"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-500 transition-colors hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
