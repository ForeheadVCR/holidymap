"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import MapContainer from "@/components/map/MapContainer";
import { usePins } from "@/hooks/usePins";
import { useCategories } from "@/hooks/useCategories";

export default function MapPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRegion = searchParams.get("region") || "europe";
  const [activeRegion, setActiveRegion] = useState(initialRegion);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(["all"])
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session } = useSession();
  const { categories } = useCategories();
  const { pins, isLoading, mutate: mutatePins } = usePins(activeRegion, searchQuery);

  const handleRegionChange = useCallback(
    (region: string) => {
      setActiveRegion(region);
      router.push(`/map?region=${region}`, { scroll: false });
    },
    [router]
  );

  const handleToggleCategory = useCallback((slug: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has("all")) {
        // Switch from "all" to specific: enable everything except the toggled one
        next.delete("all");
        // We need categories here, but since this is a toggle, we just flip
      }
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const handleToggleGroup = useCallback(
    (group: string) => {
      if (!categories) return;
      const groupSlugs = categories
        .filter((c) => c.group === group)
        .map((c) => c.slug);

      setEnabledCategories((prev) => {
        const next = new Set(prev);
        const allEnabled = groupSlugs.every((s) => next.has(s) || next.has("all"));

        if (allEnabled && !next.has("all")) {
          groupSlugs.forEach((s) => next.delete(s));
        } else {
          groupSlugs.forEach((s) => next.add(s));
        }
        next.delete("all");
        return next;
      });
    },
    [categories]
  );

  // Filter pins based on enabled categories
  const filteredPins = pins?.filter((pin) => {
    if (enabledCategories.has("all")) return true;
    return enabledCategories.has(pin.category.slug);
  });

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categories={categories || []}
          enabledCategories={enabledCategories}
          onToggleCategory={handleToggleCategory}
          onToggleGroup={handleToggleGroup}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeRegion={activeRegion}
          onRegionChange={handleRegionChange}
          isAdmin={session?.user?.isAdmin}
        />
        <main className="flex-1">
          <MapContainer
            pins={filteredPins || []}
            isLoading={isLoading}
            activeRegion={activeRegion}
            onPinPlaced={() => mutatePins()}
            currentUserId={session?.user?.id}
            canEdit={session?.user?.canEdit}
            isAdmin={session?.user?.isAdmin}
            onPinDeleted={() => mutatePins()}
          />
        </main>
      </div>
    </div>
  );
}
