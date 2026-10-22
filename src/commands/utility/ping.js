import { InteractionContextType, SlashCommandBuilder } from "discord.js";

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

  async executeSlash(interaction, { pingStats }) {
    const totals = await pingStats.record(interaction.user.id);
    return interaction.reply(createPingReply(totals));
  },

  async executePrefix(message, _args, { pingStats }) {
    const totals = await pingStats.record(message.author.id);
    return message.reply(createPingReply(totals));
  },
};

function createPingReply({ global, user }) {
  return `🏓 **Pong!**\nGlobal pings: **${global}**\nYour pings: **${user}**`;
}
