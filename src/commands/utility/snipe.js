import {
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { theme } from "../../discord/theme.js";
import { createEmbed } from "../../discord/ui.js";

export default {
  name: "snipe",
  prefixAliases: ["snipe"],

  data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("Show the latest deleted message in this channel.")
    .setContexts(InteractionContextType.Guild),

  async executeSlash(interaction, context) {
    const response = await createSnipeResponse(
      interaction.channelId,
      interaction.user.id,
      context,
    );

    return interaction.reply(response);
  },

  async executePrefix(message, _args, context) {
    const response = await createSnipeResponse(message.channelId, message.author.id, context);
    const { flags: _flags, ...messageResponse } = response;
    return message.reply(messageResponse);
  },
};

async function createSnipeResponse(
  channelId,
  requesterId,
  { snipeCache, snipedMessages },
) {
  const deletedMessage = snipeCache.get(channelId);

  if (!deletedMessage) {
    return {
      content: "There is no deleted message to snipe in this channel from the last 30 seconds.",
      flags: MessageFlags.Ephemeral,
    };
  }

  const saved = await snipedMessages.save(deletedMessage, requesterId);
  snipeCache.remove(channelId, deletedMessage.messageId);

  if (!saved) {
    return {
      content: "That deleted message was already sniped.",
      flags: MessageFlags.Ephemeral,
    };
  }

  return { embeds: createSnipeEmbeds(deletedMessage) };
}

function createSnipeEmbeds(deletedMessage) {
  const attachments = deletedMessage.attachments ?? [];
  const images = attachments.filter((attachment) => attachment.contentType?.startsWith("image/"));
  const files = attachments.filter((attachment) => !attachment.contentType?.startsWith("image/"));
  const fields = [
    { name: "Author", value: `<@${deletedMessage.authorId}>`, inline: true },
    {
      name: "Deleted",
      value: `<t:${Math.floor(deletedMessage.deletedAt.getTime() / 1000)}:R>`,
      inline: true,
    },
  ];

  if (files.length > 0) {
    fields.push({
      name: "Attachments",
      value: files.map((file) => `[${file.name}](${file.url})`).join(" · "),
    });
  }

  const mainEmbed = createEmbed({
    title: "✦ sniped",
    description: deletedMessage.content || "*Image or attachment only*",
    color: theme.danger,
    fields,
    footer: "Saved to your private snipe history",
  });

  if (images[0]) mainEmbed.setImage(images[0].url);

  return [
    mainEmbed,
    ...images.slice(1, 10).map((image) => new EmbedBuilder().setColor(theme.danger).setImage(image.url)),
  ];
}
