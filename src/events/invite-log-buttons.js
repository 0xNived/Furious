import { Events, MessageFlags, PermissionFlagsBits } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.InteractionCreate,

  async execute(interaction, { guildData }) {
    if (!interaction.isButton() || !interaction.customId.startsWith("invite:")) return;

    const [, action, userId] = interaction.customId.split(":");
    const permission = action === "ban" ? PermissionFlagsBits.BanMembers : PermissionFlagsBits.KickMembers;

    if (!interaction.memberPermissions.has(permission)) {
      return interaction.reply({
        content: `You need the ${action === "ban" ? "Ban Members" : "Kick Members"} permission.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      const member = await interaction.guild.members.fetch(userId);
      const reason = `Invite log action by ${interaction.user.id}`;

      if (action === "ban") {
        await member.ban({ reason });
      } else {
        await member.kick(reason);
      }

      await guildData.recordGuildLog(
        interaction.guildId,
        `invite_log_${action}`,
        interaction.user.id,
        userId,
      );

      return interaction.reply({
        content: `${action === "ban" ? "Banned" : "Kicked"} <@${userId}>.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      logger.error(`Could not ${action} ${userId} from an invite log button.`, error);
      return interaction.reply({
        content: `I could not ${action} that member. Check my permissions and role position.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
