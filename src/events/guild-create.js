import { Events } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.GuildCreate,

  async execute(guild, { inviteTracker }) {
    try {
      await inviteTracker.syncInvites(guild);
    } catch (error) {
      logger.warn(`Could not sync invites for new guild ${guild.id}.`);
      logger.error("Invite sync failed.", error);
    }
  },
};
