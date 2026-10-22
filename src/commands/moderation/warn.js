import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import {
  getModerationError,
  getReasonError,
  getSourceUserId,
  replyWithCommandError,
} from "../../discord/moderation.js";

const moderation = {
  permission: PermissionFlagsBits.ModerateMembers,
  permissionName: "Moderate Members",
  action: "warn",
};

export default {
  name: "warn",
  prefixAliases: ["warn"],

  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Record a warning for a member.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("member").setDescription("Member to warn").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the warning").setMaxLength(500).setRequired(true),
    ),

  async executeSlash(interaction, context) {
    return warn(
      interaction,
      interaction.options.getMember("member"),
      interaction.options.getString("reason", true),
      context,
    );
  },

  async executePrefix(message, args, context) {
    return warn(
      message,
      message.mentions.members.first() ?? message.guild.members.cache.get(args[0]),
      args.slice(1).join(" "),
      context,
    );
  },
};

async function warn(source, member, reason, { guildData, warningData }) {
  const error = getModerationError(source, member, moderation) ?? getReasonError(reason);
  if (error) return replyWithCommandError(source, error);

  const moderatorId = getSourceUserId(source);
  const savedWarning = await warningData.add({
    guildId: source.guildId,
    userId: member.id,
    moderatorId,
    reason: reason.trim(),
  });
  await guildData.recordGuildLog(source.guildId, "warn", moderatorId, member.id, {
    reason: reason.trim(),
    warningId: savedWarning.id,
  });

  return source.reply(`Warned ${member.user.tag}. Warning #${savedWarning.id}: ${reason.trim()}`);
}
