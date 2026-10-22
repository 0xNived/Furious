import { Events } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client, { inviteTracker, slashCommands }) {
    logger.info(
      `Onion is online as ${client.user.tag} with ${slashCommands.size} command${
        slashCommands.size === 1 ? "" : "s"
      }.`,
    );

    for (const guild of client.guilds.cache.values()) {
      try {
        await inviteTracker.syncInvites(guild);
      } catch (error) {
        logger.warn(`Could not sync invites for ${guild.id}.`);
        logger.error("Invite sync failed.", error);
      }
    }
  },
};
