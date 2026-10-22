import { Events } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.ClientReady,
  once: true,

  execute(client, { slashCommands }) {
    logger.info(
      `Onion is online as ${client.user.tag} with ${slashCommands.size} command${
        slashCommands.size === 1 ? "" : "s"
      }.`,
    );
  },
};
