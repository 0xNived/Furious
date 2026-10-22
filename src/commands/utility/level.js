import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import { createEmbed } from "../../discord/ui.js";
import { getLevelProgress } from "../../xp/levels.js";

export default {
  name: "level",
  prefixAliases: ["level"],

  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("View a member's server experience and rank.")
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option.setName("member").setDescription("Member to view"),
    ),

  async executeSlash(interaction, { xpStats }) {
    const member = interaction.options.getUser("member") ?? interaction.user;
    const stats = await xpStats.getMember(interaction.guildId, member.id);
    return interaction.reply({ embeds: [createLevelEmbed(member.username, stats)] });
  },

  async executePrefix(message, _args, { xpStats }) {
    const member = message.mentions.users.first() ?? message.author;
    const stats = await xpStats.getMember(message.guildId, member.id);
    return message.reply({ embeds: [createLevelEmbed(member.username, stats)] });
  },
};

function createLevelEmbed(username, stats) {
  const progress = getLevelProgress(stats.totalXp);
  const rank = stats.rank ? `#${stats.rank} of ${stats.memberCount}` : "Unranked";

  return createEmbed({
    title: `${username}'s level`,
    fields: [
      { name: "Level", value: String(progress.level), inline: true },
      { name: "Server rank", value: rank, inline: true },
      {
        name: `Experience (${progress.percentage}%)`,
        value: `${progress.currentXp}/${progress.neededXp} XP`,
        inline: true,
      },
    ],
    footer: `Total experience: ${stats.totalXp}`,
  });
}
