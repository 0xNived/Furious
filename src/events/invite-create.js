import { Events } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.InviteCreate,

  async execute(invite, { inviteTracker }) {
    try {
      await inviteTracker.syncInvites(invite.guild);
    } catch (error) {
      logger.warn(`Could not sync invites for ${invite.guild.id}.`);
      logger.error("Invite sync failed.", error);
    }
  },
};
