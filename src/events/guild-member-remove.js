import { Events } from "discord.js";
import { logger } from "../logging/logger.js";

export default {
  name: Events.GuildMemberRemove,

  async execute(member, { guildData }) {
    try {
      await guildData.recordInviteLeave(member.guild.id, member.user.id);
    } catch (error) {
      logger.error(`Could not record the leave for ${member.user.id}.`, error);
    }
  },
};
