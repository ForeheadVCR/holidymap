/**
 * Admin Discord user IDs — these users can delete any pin.
 * Set via ADMIN_DISCORD_IDS env var as a comma-separated list.
 */
const ADMIN_DISCORD_IDS: string[] = (process.env.ADMIN_DISCORD_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export function isAdmin(discordId: string | null | undefined): boolean {
  if (!discordId) return false;
  return ADMIN_DISCORD_IDS.includes(discordId);
}
