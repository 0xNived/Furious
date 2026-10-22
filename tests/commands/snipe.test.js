import test from "node:test";
import assert from "node:assert/strict";
import snipe from "../../src/commands/utility/snipe.js";

test("snipe saves a deleted message before showing it", async () => {
  const replies = [];
  const saved = [];
  const deletedMessage = {
    messageId: "deleted",
    guildId: "guild",
    channelId: "channel",
    authorId: "author",
    authorName: "Onion",
    content: "Deleted message",
    attachments: [
      { name: "cat.png", url: "https://example.com/cat.png", contentType: "image/png" },
    ],
    deletedAt: new Date("2026-01-01T00:00:00Z"),
  };

  await snipe.executeSlash(
    {
      channelId: "channel",
      user: { id: "requester" },
      reply: async (response) => replies.push(response),
    },
    {
      snipeCache: {
        get: () => deletedMessage,
        remove: () => {},
      },
      snipedMessages: {
        save: async (message, requesterId) => {
          saved.push({ message, requesterId });
          return true;
        },
      },
    },
  );

  assert.deepEqual(saved, [{ message: deletedMessage, requesterId: "requester" }]);
  assert.equal(replies[0].embeds[0].data.title, "✦ sniped");
  assert.equal(replies[0].embeds[0].data.image.url, "https://example.com/cat.png");
});
