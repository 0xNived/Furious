import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { createEmbed } from "../../discord/ui.js";

export default {
  name: "invites",
  prefixAliases: ["invites"],

  data: new SlashCommandBuilder()
    .setName("invites")
    .setDescription("View your invite statistics or configure invite logs.")
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((subcommand) => subcommand.setName("me").setDescription("View your invite statistics."))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("log")
        .setDescription("Set the invite log channel.")
        .addChannelOption((option) => option.setName("channel").setDescription("Channel for join logs").setRequired(true)),
    ),

  async executeSlash(interaction, context) {
    if (interaction.options.getSubcommand() === "log") {
      const channel = interaction.options.getChannel("channel", true);
      return setLogChannel(interaction, channel, context);
    }

    return showInviteStats(interaction, interaction.user.id, context);
  },

  async executePrefix(message, args, context) {
    if (args[0]?.toLowerCase() === "log") {
      const channel = message.mentions.channels.first() ?? message.guild.channels.cache.get(args[1]);
      return setLogChannel(message, channel, context);
    }

    return showInviteStats(message, message.author.id, context);
  },
};

async function setLogChannel(source, channel, { guildData }) {
  const hasPermission = source.memberPermissions?.has(PermissionFlagsBits.ManageGuild)
    ?? source.member?.permissions.has(PermissionFlagsBits.ManageGuild);

  if (!hasPermission) {
    return reply(source, "You need the Manage Server permission to set the invite log channel.", true);
  }

  if (!channel?.isTextBased()) {
    return reply(source, "Choose a text channel for invite logs.", true);
  }

  await guildData.setInviteLogChannel(source.guildId, channel.id, source.author?.id ?? source.user.id);
  return reply(source, `Invite logs will be sent to ${channel}.`, true);
}

async function showInviteStats(source, userId, { guildData }) {
  const stats = await guildData.getInviteStats(source.guildId, userId);
  return reply(source, {
    embeds: [
      createEmbed({
        title: "✦ your invites",
        fields: [
          { name: "Current", value: String(stats.current), inline: true },
          { name: "Total", value: String(stats.total), inline: true },
          { name: "Left", value: String(stats.left), inline: true },
          { name: "Fake", value: String(stats.fake), inline: true },
        ],
        footer: "Rejoins count as new invite uses",
      }),
    ],
  });
}

function reply(source, response, ephemeral = false) {
  const payload = typeof response === "string" ? { content: response } : response;

  if ("user" in source) {
    return source.reply({ ...payload, ...(ephemeral ? { flags: MessageFlags.Ephemeral } : {}) });
  }

  return source.reply(payload);
}
