const deletedMessages = new Map();
const ttlMilliseconds = 30_000;

export function rememberDeletedMessage(message) {
  if (
    !message.inGuild() ||
    message.partial ||
    message.author?.bot ||
    (!message.content && (message.attachments?.size ?? 0) === 0)
  ) {
    return;
  }

  const deletedMessage = {
    messageId: message.id,
    guildId: message.guildId,
    channelId: message.channelId,
    authorId: message.author.id,
    authorName: message.author.username,
    content: message.content,
    attachments: [...(message.attachments?.values() ?? [])].map((attachment) => ({
      name: attachment.name ?? "attachment",
      url: attachment.url,
      contentType: attachment.contentType,
    })),
    deletedAt: new Date(),
  };

  deletedMessages.set(message.channelId, deletedMessage);

  const timer = setTimeout(() => {
    if (deletedMessages.get(message.channelId)?.messageId === message.id) {
      deletedMessages.delete(message.channelId);
    }
  }, ttlMilliseconds);

  timer.unref();
}

export function getDeletedMessage(channelId) {
  const deletedMessage = deletedMessages.get(channelId);
  if (!deletedMessage) return null;

  if (Date.now() - deletedMessage.deletedAt.getTime() > ttlMilliseconds) {
    deletedMessages.delete(channelId);
    return null;
  }

  return deletedMessage;
}

export function removeDeletedMessage(channelId, messageId) {
  if (deletedMessages.get(channelId)?.messageId === messageId) {
    deletedMessages.delete(channelId);
  }
}

export const snipeCache = {
  get: getDeletedMessage,
  remember: rememberDeletedMessage,
  remove: removeDeletedMessage,
};
