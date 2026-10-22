import { InteractionContextType, SlashCommandBuilder } from "discord.js";

const reply = "Pong!";

/**
 * A small command used to verify that both command entry points work.
 *
 * Slash handler: command.executeSlash(interaction)
 * Prefix handler: command.executePrefix(message)
 */
export default {
  name: "ping",
  prefixAliases: ["ping"],

  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check whether Onion is online.")
    .setContexts(InteractionContextType.Guild),

  async executeSlash(interaction) {
    return interaction.reply(reply);
  },

  async executePrefix(message) {
    return message.reply(reply);
  },
};
