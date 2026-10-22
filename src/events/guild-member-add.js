import { ButtonStyle, Events } from "discord.js";
import { createButton, createButtonRow, createEmbed } from "../discord/ui.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.GuildMemberAdd,

  async execute(member, { guildData, inviteTracker }) {
    let invite;
    try {
      invite = await inviteTracker.findUsedInvite(member.guild);
    } catch (error) {
      logger.error(`Could not identify the invite used by ${member.user.id}.`, error);
    }

    const inviterId = invite?.inviterId ?? null;
    const isFake = Date.now() - member.user.createdTimestamp < 7 * 24 * 60 * 60 * 1_000;

    try {
      await guildData.recordInviteJoin({
        guildId: member.guild.id,
        userId: member.user.id,
        inviterId,
        inviteCode: invite?.code ?? null,
        isFake,
      });

      const channelId = await guildData.getInviteLogChannel(member.guild.id);
      if (!channelId) return;

      const channel = await member.guild.channels.fetch(channelId);
      if (!channel?.isTextBased()) return;

      const joinedAt = Math.floor(Date.now() / 1_000);
      const accountCreatedAt = Math.floor(member.user.createdTimestamp / 1_000);
      const embed = createEmbed({
        title: "New user",
        fields: [
          {
            name: "User",
            value: `<@${member.user.id}> (\`${member.user.id}\`)\nAccount: <t:${accountCreatedAt}:D>`,
          },
          {
            name: "Inviter",
            value: inviterId ? `<@${inviterId}> (\`${inviterId}\`)` : "Unknown",
          },
          { name: "Joined at", value: `<t:${joinedAt}:F>` },
        ],
      }).setThumbnail(member.user.displayAvatarURL({ size: 256 }));

      await channel.send({
        embeds: [embed],
        components: [
          createButtonRow([
            createButton({ customId: `invite:kick:${member.user.id}`, label: "Kick", style: ButtonStyle.Danger }),
            createButton({ customId: `invite:ban:${member.user.id}`, label: "Ban", style: ButtonStyle.Danger }),
          ]),
        ],
      });
    } catch (error) {
      logger.error(`Could not record the join for ${member.user.id}.`, error);
    }
  },
};
