import { prisma } from "./prisma";

/**
 * Log an activity event. Fire-and-forget — errors are caught and logged
 * so they don't affect the main request.
 */
export function logActivity(
  action: string,
  userId: string,
  details: Record<string, unknown>,
  regionId?: string
) {
  prisma.activityLog
    .create({
      data: {
        action,
        userId,
        details: JSON.stringify(details),
        regionId: regionId ?? null,
      },
    })
    .catch((err) => {
      console.error("Failed to write activity log:", err);
    });
}
