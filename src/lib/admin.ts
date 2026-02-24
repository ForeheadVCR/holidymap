/**
 * Admin Discord user IDs — these users can delete any pin.
 */
export const ADMIN_DISCORD_IDS = [
  "144196641610530817",
  "397171121918836736",
  "320647769461227531",
];

export function isAdmin(discordId: string | null | undefined): boolean {
  if (!discordId) return false;
  return ADMIN_DISCORD_IDS.includes(discordId);
}
