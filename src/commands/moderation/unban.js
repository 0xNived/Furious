import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import {
  getBotPermissionError,
  getPermissionError,
  getReasonError,
  getSourceUserId,
  replyWithCommandError,
} from "../../discord/moderation.js";

export default {
  name: "unban",
  prefixAliases: ["unban"],

  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Remove a ban from a user.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("Banned user to unban").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the unban").setMaxLength(500).setRequired(true),
    ),

  async executeSlash(interaction, context) {
    return unban(
      interaction,
      interaction.options.getUser("user", true),
      interaction.options.getString("reason", true),
      context,
    );
  },

  async executePrefix(message, args, context) {
    const user = message.mentions.users.first();
    const userId = user?.id ?? args[0];

    if (!/^\d{17,20}$/.test(userId ?? "")) {
      return replyWithCommandError(message, "Mention a banned user or provide their user ID.");
    }

    return unban(message, { id: userId, tag: `<@${userId}>` }, args.slice(1).join(" "), context);
  },
};

async function unban(source, user, reason, { guildData }) {
  const error = getPermissionError(source, PermissionFlagsBits.BanMembers, "Ban Members", "unban")
    ?? getBotPermissionError(source, PermissionFlagsBits.BanMembers, "Ban Members", "unban")
    ?? getReasonError(reason);
  if (error) return replyWithCommandError(source, error);

  await source.guild.bans.remove(user.id, reason.trim());
  await guildData.recordGuildLog(source.guildId, "unban", getSourceUserId(source), user.id, {
    reason: reason.trim(),
  });

  return source.reply(`Unbanned ${user.tag}. Reason: ${reason.trim()}`);
}
