export const CATEGORY_GROUPS = {
  poi: { label: "Points of Interest", color: "#f59e0b" },
  spice: { label: "Spice", color: "#f97316" },
  resources: { label: "Resources", color: "#3b82f6" },
  other: { label: "Other", color: "#8b5cf6" },
} as const;

export type CategoryGroup = keyof typeof CATEGORY_GROUPS;

export const CATEGORIES = [
  // Points of Interest
  { name: "Cave", group: "poi", slug: "cave", color: "#f59e0b", sortOrder: 0 },
  { name: "Shipwreck", group: "poi", slug: "shipwreck", color: "#d97706", sortOrder: 1 },
  { name: "Fallen Shipwreck", group: "poi", slug: "fallen-shipwreck", color: "#b45309", sortOrder: 2 },
  { name: "Testing Station", group: "poi", slug: "testing-station", color: "#eab308", sortOrder: 3 },
  { name: "Loot Container", group: "poi", slug: "loot-container", color: "#ca8a04", sortOrder: 4 },
  { name: "Intel Pickup", group: "poi", slug: "intel-pickup", color: "#a3e635", sortOrder: 5 },
  { name: "House Representative", group: "poi", slug: "house-rep", color: "#84cc16", sortOrder: 6 },
  // Spice
  { name: "Spice Field (Large)", group: "spice", slug: "spice-large", color: "#ea580c", sortOrder: 10 },
  { name: "Spice Field (Medium)", group: "spice", slug: "spice-medium", color: "#f97316", sortOrder: 11 },
  { name: "Spice Field (Small)", group: "spice", slug: "spice-small", color: "#fb923c", sortOrder: 12 },
  // Resources
  { name: "Aluminum Ore", group: "resources", slug: "aluminum-ore", color: "#94a3b8", sortOrder: 20 },
  { name: "Basalt Stone", group: "resources", slug: "basalt-stone", color: "#64748b", sortOrder: 21 },
  { name: "Carbon Ore", group: "resources", slug: "carbon-ore", color: "#475569", sortOrder: 22 },
  { name: "Copper Ore", group: "resources", slug: "copper-ore", color: "#c2410c", sortOrder: 23 },
  { name: "Erythrite Crystal", group: "resources", slug: "erythrite-crystal", color: "#e879f9", sortOrder: 24 },
  { name: "Flour Sand", group: "resources", slug: "flour-sand", color: "#fde68a", sortOrder: 25 },
  { name: "Granite Stone", group: "resources", slug: "granite-stone", color: "#78716c", sortOrder: 26 },
  { name: "Impure Fuel", group: "resources", slug: "impure-fuel", color: "#65a30d", sortOrder: 27 },
  { name: "Iron Ore", group: "resources", slug: "iron-ore", color: "#a8a29e", sortOrder: 28 },
  { name: "Jasmium Crystal", group: "resources", slug: "jasmium-crystal", color: "#7dd3fc", sortOrder: 29 },
  { name: "Plant Fiber", group: "resources", slug: "plant-fiber", color: "#4ade80", sortOrder: 30 },
  { name: "Scrap Metal", group: "resources", slug: "scrap-metal", color: "#6b7280", sortOrder: 31 },
  { name: "Stravidium Mass", group: "resources", slug: "stravidium-mass", color: "#a78bfa", sortOrder: 32 },
  { name: "Titanium Ore", group: "resources", slug: "titanium-ore", color: "#e2e8f0", sortOrder: 33 },
  // Other
  { name: "Taxi Service", group: "other", slug: "taxi-service", color: "#fbbf24", sortOrder: 40 },
  { name: "Community Pin", group: "other", slug: "community-pin", color: "#8b5cf6", sortOrder: 41 },
] as const;

export const REGIONS = [
  { name: "Asia", slug: "asia" },
  { name: "Europe", slug: "europe" },
  { name: "North America", slug: "north-america" },
  { name: "Oceania", slug: "oceania" },
  { name: "South America", slug: "south-america" },
] as const;
