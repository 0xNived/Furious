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

    try {
      await inviteTracker.syncGuildInvites(client.guilds.cache.values());
    } catch (error) {
      logger.warn("Could not sync every guild invite snapshot.");
      logger.error("Invite sync failed.", error);
    }
  },
};
