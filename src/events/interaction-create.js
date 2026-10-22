import { Events, MessageFlags } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.InteractionCreate,

  async execute(interaction, context) {
    if (!interaction.isChatInputCommand()) return;

    const command = context.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
      await context.xpStats.recordActivity(interaction.guildId, interaction.user.id);
      await command.executeSlash(interaction, context);
    } catch (error) {
      logger.error(`Slash command /${interaction.commandName} failed.`, error);
      await replyWithError(interaction);
    }
  },
};

async function replyWithError(interaction) {
  const response = {
    content: "Something went wrong while running that command.",
    flags: MessageFlags.Ephemeral,
  };

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(response);
  } else {
    await interaction.reply(response);
  }
}
