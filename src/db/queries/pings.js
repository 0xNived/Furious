import { sql } from "drizzle-orm";
import { getDatabase } from "../client.js";
import { globalPingStats, userPingStats } from "../schema/index.js";

const globalStatsId = "global";

/**
 * Increment and return the global and per-user ping totals.
 *
 * Both writes run in one transaction, so a successful ping always updates both totals.
 */
export async function recordPing(userId) {
  const database = getDatabase();

  return database.transaction(async (transaction) => {
    const [global] = await transaction
      .insert(globalPingStats)
      .values({ id: globalStatsId, total: 1 })
      .onConflictDoUpdate({
        target: globalPingStats.id,
        set: {
          total: sql`${globalPingStats.total} + 1`,
          updatedAt: sql`now()`,
        },
      })
      .returning({ total: globalPingStats.total });

    const [user] = await transaction
      .insert(userPingStats)
      .values({ userId, total: 1 })
      .onConflictDoUpdate({
        target: userPingStats.userId,
        set: {
          total: sql`${userPingStats.total} + 1`,
          updatedAt: sql`now()`,
        },
      })
      .returning({ total: userPingStats.total });

    return { global: global.total, user: user.total };
  });
}

export const pingStats = { record: recordPing };
