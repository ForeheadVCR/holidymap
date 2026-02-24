/**
 * Maps category slugs to their webp icon filenames in /icons/
 */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  // Points of Interest
  "cave": "cave.webp",
  "shipwreck": "shipwreck (1).webp",
  "testing-station": "ecolab.webp",
  "house-rep": "houserepresentativewayku.webp",
  // Resources — Spice
  "spice-large": "spicefieldlarge.webp",
  "spice-medium": "spicefieldmedium.webp",
  "spice-small": "spicefieldsmall.webp",
  // Resources — Materials
  "aluminum-ore": "bauxiteore.webp",
  "flour-sand": "floursand.webp",
  "impure-fuel": "fuelcellwreckage.webp",
  "plant-fiber": "plantfiber.webp",
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
