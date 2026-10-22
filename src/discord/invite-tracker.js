const snapshots = new Map();

export async function syncInvites(guild) {
  const invites = await guild.invites.fetch();
  snapshots.set(
    guild.id,
    new Map(
      [...invites.values()].map((invite) => [invite.code, {
        code: invite.code,
        uses: invite.uses ?? 0,
        inviterId: invite.inviterId,
      }]),
    ),
  );
}

export async function findUsedInvite(guild) {
  const previous = snapshots.get(guild.id);
  const invites = await guild.invites.fetch();
  const current = new Map(
    [...invites.values()].map((invite) => [invite.code, {
      code: invite.code,
      uses: invite.uses ?? 0,
      inviterId: invite.inviterId,
    }]),
  );

  snapshots.set(guild.id, current);
  if (!previous) return null;

  return [...current.values()].find((invite) => invite.uses > (previous.get(invite.code)?.uses ?? 0)) ?? null;
}

export async function syncGuildInvites(guilds) {
  for (const guild of guilds) {
    await syncInvites(guild);
  }
}

export const inviteTracker = { findUsedInvite, syncGuildInvites, syncInvites };
