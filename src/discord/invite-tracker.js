const snapshots = new Map();
const guildQueues = new Map();

export function syncInvites(guild) {
  return queueGuild(guild.id, async () => {
    const invites = await guild.invites.fetch();
    snapshots.set(guild.id, createSnapshot(invites));
  });
}

export function findUsedInvite(guild) {
  return queueGuild(guild.id, async () => {
    const previous = snapshots.get(guild.id);
    const invites = await guild.invites.fetch();
    const current = createSnapshot(invites);
    snapshots.set(guild.id, current);

    if (!previous) return null;

    const changed = [...current.values()].filter((invite) => {
      const previousInvite = previous.get(invite.code);
      return previousInvite && invite.uses - previousInvite.uses === 1;
    });

    return changed.length === 1 ? changed[0] : null;
  });
}

export async function syncGuildInvites(guilds) {
  for (const guild of guilds) {
    await syncInvites(guild);
  }
}

function createSnapshot(invites) {
  return new Map(
    [...invites.values()].map((invite) => [
      invite.code,
      {
        code: invite.code,
        uses: invite.uses ?? 0,
        inviterId: invite.inviterId,
      },
    ]),
  );
}

function queueGuild(guildId, task) {
  const previous = guildQueues.get(guildId) ?? Promise.resolve();
  const queued = previous.catch(() => undefined).then(task);

  guildQueues.set(guildId, queued);
  const clearQueue = () => {
    if (guildQueues.get(guildId) === queued) {
      guildQueues.delete(guildId);
    }
  };
  void queued.then(clearQueue, clearQueue);

  return queued;
}

export const inviteTracker = { findUsedInvite, syncGuildInvites, syncInvites };
