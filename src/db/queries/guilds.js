import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { getDatabase } from "../client.js";
import { guildLogs, guildSettings, inviteJoins } from "../schema/index.js";

export async function setInviteLogChannel(guildId, channelId, actorId) {
  const database = getDatabase();

  await database.transaction(async (transaction) => {
    await transaction
      .insert(guildSettings)
      .values({ guildId, inviteLogChannelId: channelId })
      .onConflictDoUpdate({
        target: guildSettings.guildId,
        set: { inviteLogChannelId: channelId, updatedAt: sql`now()` },
      });

    await transaction.insert(guildLogs).values({
      guildId,
      action: "invite_log_configured",
      actorId,
      details: { channelId },
    });
  });
}

export async function getInviteLogChannel(guildId) {
  const database = getDatabase();
  const [settings] = await database
    .select({ channelId: guildSettings.inviteLogChannelId })
    .from(guildSettings)
    .where(eq(guildSettings.guildId, guildId));

  return settings?.channelId ?? null;
}

export async function recordGuildLog(guildId, action, actorId, targetId, details = {}) {
  const database = getDatabase();
  await database.insert(guildLogs).values({ guildId, action, actorId, targetId, details });
}

export async function recordInviteJoin(join) {
  const database = getDatabase();
  await database.insert(inviteJoins).values(join);
}

export async function recordInviteLeave(guildId, userId) {
  const database = getDatabase();
  const [join] = await database
    .select({ id: inviteJoins.id })
    .from(inviteJoins)
    .where(and(eq(inviteJoins.guildId, guildId), eq(inviteJoins.userId, userId), isNull(inviteJoins.leftAt)))
    .orderBy(desc(inviteJoins.joinedAt))
    .limit(1);

  if (!join) return;

  await database.update(inviteJoins).set({ leftAt: new Date() }).where(eq(inviteJoins.id, join.id));
}

export async function getInviteStats(guildId, inviterId) {
  const database = getDatabase();
  const [stats] = await database
    .select({
      total: sql`count(*)::int`,
      current: sql`count(*) filter (where ${inviteJoins.leftAt} is null)::int`,
      left: sql`count(*) filter (where ${inviteJoins.leftAt} is not null)::int`,
      fake: sql`count(*) filter (where ${inviteJoins.isFake})::int`,
    })
    .from(inviteJoins)
    .where(and(eq(inviteJoins.guildId, guildId), eq(inviteJoins.inviterId, inviterId)));

  return stats;
}

export const guildData = {
  getInviteLogChannel,
  getInviteStats,
  recordGuildLog,
  recordInviteJoin,
  recordInviteLeave,
  setInviteLogChannel,
};
