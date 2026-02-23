/**
 * Maps category slugs to their webp icon filenames in /icons/
 */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  // Points of Interest
  "cave": "cave.webp",
  "shipwreck": "shipwreck (1).webp",
  "fallen-shipwreck": "smallshipwreck.webp",
  "testing-station": "ecolab.webp",
  "loot-container": "lootcontainer.webp",
  "intel-pickup": "intel.webp",
  "house-rep": "houserepresentativewayku.webp",
  // Spice
  "spice-large": "spicefieldlarge.webp",
  "spice-medium": "spicefieldmedium.webp",
  "spice-small": "spicefieldsmall.webp",
  // Resources
  "aluminum-ore": "bauxiteore.webp",
  "basalt-stone": "basaltore.webp",
  "carbon-ore": "rhyoliteore.webp",
  "copper-ore": "azuriteore.webp",
  "erythrite-crystal": "erythriteore.webp",
  "flour-sand": "floursand.webp",
  "granite-stone": "dolomiterock.webp",
  "impure-fuel": "fuelcellwreckage.webp",
  "iron-ore": "magnetiteore.webp",
  "jasmium-crystal": "jasmiumore.webp",
  "plant-fiber": "plantfiber.webp",
  "scrap-metal": "scrapmetalwreckage.webp",
  "stravidium-mass": "stravidiumore.webp",
  "titanium-ore": "titaniumore.webp",
  // Other
  "taxi-service": "taxiservice.webp",
  "community-pin": "community-pin.svg",
};

export function getCategoryIconUrl(slug: string): string {
  const filename = CATEGORY_ICON_MAP[slug];
  if (filename) return `/icons/${encodeURIComponent(filename)}`;
  return `/icons/${slug}.svg`;
}
