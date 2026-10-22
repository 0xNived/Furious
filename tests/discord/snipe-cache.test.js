import test from "node:test";
import assert from "node:assert/strict";
import { getDeletedMessage, rememberDeletedMessage } from "../../src/discord/snipe-cache.js";

test("deleted messages are available only in their own channel", () => {
  rememberDeletedMessage({
    id: "deleted-message",
    guildId: "guild",
    channelId: "snipe-test-channel",
    content: "deleted content",
    author: { id: "author", username: "Onion", bot: false },
    inGuild: () => true,
    partial: false,
  });

  assert.equal(getDeletedMessage("another-channel"), null);
  assert.equal(getDeletedMessage("snipe-test-channel")?.content, "deleted content");
});
