import { and, eq, gt, lt, or, sql } from "drizzle-orm";
import { getDatabase } from "../client.js";
import { memberXp } from "../schema/index.js";
import { ACTIVITY_COOLDOWN_SECONDS, ACTIVITY_XP } from "../../xp/levels.js";

export async function recordActivity(guildId, userId) {
  const database = getDatabase();
  const [member] = await database
    .insert(memberXp)
    .values({ guildId, userId, totalXp: ACTIVITY_XP, lastActivityAt: new Date() })
    .onConflictDoUpdate({
      target: [memberXp.guildId, memberXp.userId],
      set: {
        totalXp: sql`${memberXp.totalXp} + ${ACTIVITY_XP}`,
        lastActivityAt: sql`now()`,
        updatedAt: sql`now()`,
      },
      where: sql`${memberXp.lastActivityAt} <= now() - ${ACTIVITY_COOLDOWN_SECONDS} * interval '1 second'`,
    })
    .returning({ totalXp: memberXp.totalXp });

  return member ? { earned: true, totalXp: member.totalXp } : { earned: false };
}

export async function getMemberXp(guildId, userId) {
  const database = getDatabase();
  const [member] = await database
    .select({ totalXp: memberXp.totalXp })
    .from(memberXp)
    .where(and(eq(memberXp.guildId, guildId), eq(memberXp.userId, userId)));

  const [memberCount] = await database
    .select({ count: sql`count(*)::int` })
    .from(memberXp)
    .where(eq(memberXp.guildId, guildId));

  if (!member) {
    return { totalXp: 0, rank: null, memberCount: memberCount.count };
  }

  const [rank] = await database
    .select({ position: sql`count(*)::int + 1` })
    .from(memberXp)
    .where(
      and(
        eq(memberXp.guildId, guildId),
        or(
          gt(memberXp.totalXp, member.totalXp),
          and(eq(memberXp.totalXp, member.totalXp), lt(memberXp.userId, userId)),
        ),
      ),
    );

  return {
    totalXp: member.totalXp,
    rank: rank.position,
    memberCount: memberCount.count,
  };
}

export const xpStats = { getMember: getMemberXp, recordActivity };
