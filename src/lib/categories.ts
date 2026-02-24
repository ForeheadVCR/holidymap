export const CATEGORY_GROUPS = {
  poi: { label: "Points of Interest", color: "#f59e0b" },
  resources: { label: "Resources", color: "#3b82f6" },
  community: { label: "Community", color: "#8b5cf6" },
} as const;

export type CategoryGroup = keyof typeof CATEGORY_GROUPS;

export const CATEGORIES = [
  // Points of Interest
  { name: "Cave", group: "poi", slug: "cave", color: "#f59e0b", sortOrder: 0 },
  { name: "Shipwreck", group: "poi", slug: "shipwreck", color: "#d97706", sortOrder: 1 },
  { name: "Testing Station", group: "poi", slug: "testing-station", color: "#eab308", sortOrder: 2 },
  { name: "House Representative", group: "poi", slug: "house-rep", color: "#84cc16", sortOrder: 3 },
  // Resources — Spice fields at top, then ores/materials
  { name: "Spice Field (Large)", group: "resources", slug: "spice-large", color: "#ea580c", sortOrder: 10 },
  { name: "Spice Field (Medium)", group: "resources", slug: "spice-medium", color: "#f97316", sortOrder: 11 },
  { name: "Spice Field (Small)", group: "resources", slug: "spice-small", color: "#fb923c", sortOrder: 12 },
  { name: "Aluminum", group: "resources", slug: "aluminum-ore", color: "#94a3b8", sortOrder: 20 },
  { name: "Flour Sand", group: "resources", slug: "flour-sand", color: "#fde68a", sortOrder: 21 },
  { name: "Fuel Cells", group: "resources", slug: "impure-fuel", color: "#65a30d", sortOrder: 22 },
  { name: "Plant Fiber", group: "resources", slug: "plant-fiber", color: "#4ade80", sortOrder: 23 },
  { name: "Stravidium", group: "resources", slug: "stravidium-mass", color: "#a78bfa", sortOrder: 24 },
  { name: "Titanium", group: "resources", slug: "titanium-ore", color: "#e2e8f0", sortOrder: 25 },
  // Community
  { name: "Guild Base", group: "community", slug: "guild-base", color: "#a78bfa", sortOrder: 40 },
  { name: "Public Depot", group: "community", slug: "public-depot", color: "#60a5fa", sortOrder: 41 },
  { name: "Community Pin", group: "community", slug: "community-pin", color: "#8b5cf6", sortOrder: 42 },
] as const;

// Slugs of categories that have been removed and should be cleaned up from the DB
export const REMOVED_CATEGORY_SLUGS = [
  "fallen-shipwreck",
  "loot-container",
  "intel-pickup",
  "basalt-stone",
  "carbon-ore",
  "copper-ore",
  "erythrite-crystal",
  "granite-stone",
  "iron-ore",
  "jasmium-crystal",
  "scrap-metal",
  "taxi-service",
] as const;

export const REGIONS = [
  { name: "Asia", slug: "asia" },
  { name: "Europe", slug: "europe" },
  { name: "North America", slug: "north-america" },
  { name: "Oceania", slug: "oceania" },
  { name: "South America", slug: "south-america" },
] as const;
