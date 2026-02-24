"use client";

import { useState } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { CATEGORY_GROUPS, type CategoryGroup } from "@/lib/categories";

interface PinPlacementModalProps {
  x: number;
  y: number;
  gridCell: string;
  activeRegion: string;
  onClose: () => void;
  onPlaced: () => void;
}

export default function PinPlacementModal({
  x,
  y,
  gridCell,
  activeRegion,
  onClose,
  onPlaced,
}: PinPlacementModalProps) {
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    const cat = categories?.find((c) => c.id === selectedCategory);
    if (cat?.slug === "community-pin" && !note.trim()) {
      setError("Community pins require a note");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x,
          y,
          categoryId: selectedCategory,
          region: activeRegion,
          note: note.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to place pin");
        return;
      }

      onPlaced();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const groups = Object.entries(CATEGORY_GROUPS) as [CategoryGroup, typeof CATEGORY_GROUPS[CategoryGroup]][];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="animate-modal-in w-full max-w-md overflow-hidden rounded-xl border border-dune-dark-700/80 border-t-2 border-t-dune-spice-500 bg-dune-dark-900 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-dune-spice-500" />
            <h2 className="font-semibold text-gray-100">Place Pin</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-dune-dark-800 hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
          {/* Divider glow line */}
          <div className="glow-line absolute bottom-0 left-4 right-4" />
        </div>

        <div className="p-5">
          <div className="mb-4 rounded-lg bg-dune-dark-800/80 px-3 py-2 font-mono text-sm text-gray-300">
            Grid Cell: <span className="text-dune-spice-400 font-medium">{gridCell}</span>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-dune-dark-700/80 bg-dune-dark-800 px-3 py-2.5 text-sm text-gray-200 outline-none transition-all focus:border-dune-spice-500/70 focus:ring-2 focus:ring-dune-spice-500/20"
            >
              <option value="">Select a category...</option>
              {groups.map(([groupKey, groupInfo]) => {
                const groupCats = categories?.filter((c) => c.group === groupKey) || [];
                if (groupCats.length === 0) return null;
                return (
                  <optgroup key={groupKey} label={groupInfo.label}>
                    {groupCats.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Note{" "}
              <span className="text-gray-500">
                {categories?.find((c) => c.id === selectedCategory)?.slug ===
                "community-pin"
                  ? "(required)"
                  : "(optional)"}
              </span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add details about this location..."
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-dune-dark-700/80 bg-dune-dark-800 px-3 py-2.5 text-sm text-gray-200 placeholder-gray-500 outline-none transition-all focus:border-dune-spice-500/70 focus:ring-2 focus:ring-dune-spice-500/20"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-900/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-dune-dark-700/80 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-dune-dark-600 hover:bg-dune-dark-800 active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedCategory}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-dune-spice-500 to-dune-spice-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-dune-spice-900/30 transition-all hover:from-dune-spice-400 hover:to-dune-spice-500 active:scale-[0.97] disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Place Pin"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
