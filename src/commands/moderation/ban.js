import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import {
  getModerationError,
  getReasonError,
  getSourceUserId,
  replyWithCommandError,
} from "../../discord/moderation.js";

const moderation = {
  permission: PermissionFlagsBits.BanMembers,
  permissionName: "Ban Members",
  action: "ban",
  botAction: "bannable",
};

export default {
  name: "ban",
  prefixAliases: ["ban"],

  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from this server.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName("member").setDescription("Member to ban").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the ban").setMaxLength(500).setRequired(true),
    ),

  async executeSlash(interaction, context) {
    return ban(
      interaction,
      interaction.options.getMember("member"),
      interaction.options.getString("reason", true),
      context,
    );
  },

  async executePrefix(message, args, context) {
    return ban(
      message,
      message.mentions.members.first() ?? message.guild.members.cache.get(args[0]),
      args.slice(1).join(" "),
      context,
    );
  },
};

async function ban(source, member, reason, { guildData }) {
  const error = getModerationError(source, member, moderation) ?? getReasonError(reason);
  if (error) return replyWithCommandError(source, error);

  await member.ban({ reason: reason.trim() });
  await guildData.recordGuildLog(source.guildId, "ban", getSourceUserId(source), member.id, {
    reason: reason.trim(),
  });

  return source.reply(`Banned ${member.user.tag}. Reason: ${reason.trim()}`);
}
