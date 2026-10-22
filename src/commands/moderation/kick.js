import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import {
  getModerationError,
  getReasonError,
  getSourceUserId,
  replyWithCommandError,
} from "../../discord/moderation.js";

const moderation = {
  permission: PermissionFlagsBits.KickMembers,
  permissionName: "Kick Members",
  action: "kick",
  botAction: "kickable",
};

export default {
  name: "kick",
  prefixAliases: ["kick"],

  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Remove a member from this server.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option.setName("member").setDescription("Member to remove").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the kick").setMaxLength(500).setRequired(true),
    ),

  async executeSlash(interaction, context) {
    return kick(
      interaction,
      interaction.options.getMember("member"),
      interaction.options.getString("reason", true),
      context,
    );
  },

  async executePrefix(message, args, context) {
    return kick(
      message,
      message.mentions.members.first() ?? message.guild.members.cache.get(args[0]),
      args.slice(1).join(" "),
      context,
    );
  },
};

async function kick(source, member, reason, { guildData }) {
  const error = getModerationError(source, member, moderation) ?? getReasonError(reason);
  if (error) return replyWithCommandError(source, error);

  await member.kick(reason.trim());
  await guildData.recordGuildLog(source.guildId, "kick", getSourceUserId(source), member.id, {
    reason: reason.trim(),
  });

  return source.reply(`Kicked ${member.user.tag}. Reason: ${reason.trim()}`);
}
