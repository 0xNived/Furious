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
  const target = { reply: async (message) => replies.push(message) };

  await ping.executeSlash(target);
  await ping.executePrefix(target);

  assert.deepEqual(replies, ["Pong!", "Pong!"]);
});
