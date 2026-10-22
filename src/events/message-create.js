import { Events } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.MessageCreate,

  async execute(message, context) {
    if (!message.inGuild() || message.author.bot) return;

    if (message.content.trim().length >= 5) {
      await recordMessageActivity(message, context);
    }

    const prefix = context.prefixes.find((candidate) => message.content.startsWith(candidate));
    if (!prefix) return;

    const [name, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/\s+/);
    if (!name) return;

    const command = context.prefixCommands.get(name.toLowerCase());
    if (!command) return;

    try {
      await command.executePrefix(message, args, context);
    } catch (error) {
      logger.error(`Prefix command ${prefix}${name} failed.`, error);
      await message.reply("Something went wrong while running that command.");
    }
  },
};

async function recordMessageActivity(message, { xpStats }) {
  try {
    await xpStats.recordActivity(message.guildId, message.author.id);
  } catch (error) {
    logger.error("Could not record message activity.", error);
  }
}
