import { MessageFlags } from "discord.js";

export function getSourceUserId(source) {
  return source.user?.id ?? source.author.id;
}

export function getModerationError(source, member, { permission, permissionName, action, botAction }) {
  const permissionError = getPermissionError(source, permission, permissionName, action);
  if (permissionError) return permissionError;

  if (!member) {
    return "That user is not in this server.";
  }

  const moderatorId = getSourceUserId(source);
  if (member.id === moderatorId) {
    return `You cannot ${action} yourself.`;
  }

  if (member.id === source.guild.ownerId) {
    return `You cannot ${action} the server owner.`;
  }

  const moderator = source.member;
  if (
    moderatorId !== source.guild.ownerId
    && member.roles.highest.position >= moderator.roles.highest.position
  ) {
    return `You cannot ${action} a member with an equal or higher role.`;
  }

  if (botAction && !member[botAction]) {
    return `I cannot ${action} that member. Check my permission and role position.`;
  }

  return null;
}

export function getPermissionError(source, permission, permissionName, action) {
  const permissions = source.memberPermissions ?? source.member?.permissions;
  return permissions?.has(permission)
    ? null
    : `You need the ${permissionName} permission to ${action} members.`;
}

export function getBotPermissionError(source, permission, permissionName, action) {
  return source.guild.members.me?.permissions.has(permission)
    ? null
    : `I need the ${permissionName} permission to ${action} members.`;
}

export function getReasonError(reason) {
  if (!reason?.trim()) return "Provide a reason for this moderation action.";
  if (reason.length > 500) return "A reason can be at most 500 characters.";
  return null;
}

export function replyWithCommandError(source, content) {
  if ("user" in source) {
    return source.reply({ content, flags: MessageFlags.Ephemeral });
  }

  return source.reply(content);
}
