import test from "node:test";
import assert from "node:assert/strict";
import ping from "../../src/commands/utility/ping.js";

test("ping exposes a valid slash command", () => {
  const data = ping.data.toJSON();

  assert.equal(data.name, "ping");
  assert.equal(data.description, "Check whether Onion is online.");
});

test("ping replies through both command entry points", async () => {
  const replies = [];
  const pingStats = {
    record: async () => ({ global: 42, user: 3 }),
  };
  const slashTarget = {
    user: { id: "123" },
    reply: async (message) => replies.push(message),
  };
  const prefixTarget = {
    author: { id: "456" },
    reply: async (message) => replies.push(message),
  };

  await ping.executeSlash(slashTarget, { pingStats });
  await ping.executePrefix(prefixTarget, [], { pingStats });

  assert.deepEqual(replies, [
    "🏓 **Pong!**\nGlobal pings: **42**\nYour pings: **3**",
    "🏓 **Pong!**\nGlobal pings: **42**\nYour pings: **3**",
  ]);
});
