/**
 * Discord role-based permission checking with in-memory cache.
 * Uses the Discord bot token to fetch guild member roles.
 */

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || "";
const DISCORD_EDITOR_ROLE_ID = process.env.DISCORD_EDITOR_ROLE_ID || "";
const DISCORD_ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID || "";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedRoles {
  roles: string[];
  fetchedAt: number;
}

const roleCache = new Map<string, CachedRoles>();

/**
 * Fetch a guild member's roles from the Discord API using the bot token.
 * Returns an array of role IDs, or empty array if the user isn't in the guild.
 */
async function fetchMemberRoles(discordUserId: string): Promise<string[]> {
  if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
    console.warn("Discord bot token or guild ID not configured");
    return [];
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordUserId}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        // User is not in the guild
        return [];
      }
      console.error(`Discord API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const member = await res.json();
    return member.roles || [];
  } catch (error) {
    console.error("Failed to fetch Discord member roles:", error);
    return [];
  }
}

/**
 * Get a user's roles, using the cache if available and fresh.
 */
async function getCachedRoles(discordUserId: string): Promise<string[]> {
  const cached = roleCache.get(discordUserId);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.roles;
  }

  const roles = await fetchMemberRoles(discordUserId);
  roleCache.set(discordUserId, { roles, fetchedAt: Date.now() });
  return roles;
}

export interface UserPermissions {
  canEdit: boolean;
  isAdmin: boolean;
}

/**
 * Get a user's permissions based on their Discord guild roles.
 * - canEdit: true if user has Watersealed OR Community Admin role
 * - isAdmin: true if user has Community Admin role (can delete any pin)
 */
export async function getUserPermissions(
  discordId: string | null | undefined
): Promise<UserPermissions> {
  if (!discordId) {
    return { canEdit: false, isAdmin: false };
  }

  const roles = await getCachedRoles(discordId);
  const hasEditorRole = DISCORD_EDITOR_ROLE_ID
    ? roles.includes(DISCORD_EDITOR_ROLE_ID)
    : false;
  const hasAdminRole = DISCORD_ADMIN_ROLE_ID
    ? roles.includes(DISCORD_ADMIN_ROLE_ID)
    : false;

  return {
    canEdit: hasEditorRole || hasAdminRole,
    isAdmin: hasAdminRole,
  };
}
