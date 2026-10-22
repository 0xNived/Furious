import { Events } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.MessageCreate,

  async execute(message, { prefixCommands, prefix }) {
    if (!message.inGuild() || message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const [name, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    if (!name) return;

    const command = prefixCommands.get(name.toLowerCase());
    if (!command) return;

    try {
      await command.executePrefix(message, args);
    } catch (error) {
      logger.error(`Prefix command ${prefix}${name} failed.`, error);
      await message.reply("Something went wrong while running that command.");
    }
  },
};
