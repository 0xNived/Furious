import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { createEmbed } from "../../discord/ui.js";

export default {
  name: "inviter",
  prefixAliases: ["inviter"],

  data: new SlashCommandBuilder()
    .setName("inviter")
    .setDescription("Show who invited a member.")
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option.setName("member").setDescription("Member to look up").setRequired(true),
    ),

  async executeSlash(interaction, context) {
    const member = interaction.options.getMember("member");

    if (!member) {
      return interaction.reply({
        content: "That user is not in this server.",
        flags: MessageFlags.Ephemeral,
      });
    }

    return showInviter(interaction, member, context);
  },

  async executePrefix(message, args, { guildData }) {
    const member = message.mentions.members.first() ?? message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.reply("Mention a member: `,inviter @member`.");
    }

    return showInviter(message, member, { guildData });
  },
};

async function showInviter(source, member, { guildData }) {
  const invite = await guildData.getMemberInviter(source.guildId, member.id);
  const inviter = invite?.inviterId ? `<@${invite.inviterId}>` : "Unknown";
  const tracked = invite
    ? `<t:${Math.floor(invite.joinedAt.getTime() / 1_000)}:R>`
    : "Onion did not see this member join.";

  return source.reply({
    embeds: [
      createEmbed({
        title: "Inviter",
        description: `${member} was invited by ${inviter}.`,
        fields: [{ name: "Tracked", value: tracked }],
      }),
    ],
  });
}
