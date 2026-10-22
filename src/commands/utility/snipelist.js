import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { createEmbed } from "../../discord/ui.js";

export default {
  name: "snipelist",
  prefixAliases: ["snipelist"],

  data: new SlashCommandBuilder()
    .setName("snipelist")
    .setDescription("View your 10 most recent snipes.")
    .setContexts(InteractionContextType.Guild),

  async executeSlash(interaction, { snipedMessages }) {
    const entries = await snipedMessages.history(interaction.user.id);
    return interaction.reply(createHistoryResponse(entries));
  },

  async executePrefix(message, _args, { snipedMessages }) {
    const entries = await snipedMessages.history(message.author.id);
    const { flags: _flags, ...response } = createHistoryResponse(entries);
    return message.reply(response);
  },
};

function createHistoryResponse(entries) {
  if (entries.length === 0) {
    return {
      content: "Your private snipe history is empty.",
      flags: MessageFlags.Ephemeral,
    };
  }

  const lines = entries.map((entry, index) => {
    const content = entry.content || "*Image or attachment only*";
    const preview = content.length > 70 ? `${content.slice(0, 67)}...` : content;
    const time = Math.floor(entry.snipedAt.getTime() / 1000);
    return `**${index + 1}.** <#${entry.channelId}> · <t:${time}:R>\n${preview}`;
  });

  return {
    embeds: [
      createEmbed({
        title: "✦ your snipes",
        description: lines.join("\n\n"),
        footer: "Only you can view this history",
      }),
    ],
    flags: MessageFlags.Ephemeral,
  };
}
