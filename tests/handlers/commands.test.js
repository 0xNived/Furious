import test from "node:test";
import assert from "node:assert/strict";
import { loadCommands } from "../../src/handlers/commands.js";
import interactionCreate from "../../src/events/interaction-create.js";
import messageCreate from "../../src/events/message-create.js";

test("the command loader finds slash and prefix commands in categories", async () => {
  const commands = await loadCommands(new URL("../../src/commands/", import.meta.url));

  assert.ok(commands.slashCommands.has("ping"));
  assert.ok(commands.prefixCommands.has("ping"));
  assert.ok(commands.slashCommands.has("level"));
  assert.ok(commands.prefixCommands.has("level"));
  assert.ok(commands.slashCommands.has("snipe"));
  assert.ok(commands.prefixCommands.has("snipe"));
  assert.ok(commands.slashCommands.has("snipelist"));
  assert.ok(commands.prefixCommands.has("snipelist"));
  assert.ok(commands.slashCommands.has("invites"));
  assert.ok(commands.prefixCommands.has("invites"));
  assert.ok(commands.slashCommands.has("inviter"));
  assert.ok(commands.prefixCommands.has("inviter"));
  assert.ok(commands.slashCommands.has("kick"));
  assert.ok(commands.prefixCommands.has("kick"));
  assert.ok(commands.slashCommands.has("ban"));
  assert.ok(commands.prefixCommands.has("ban"));
  assert.ok(commands.slashCommands.has("unban"));
  assert.ok(commands.prefixCommands.has("unban"));
  assert.ok(commands.slashCommands.has("warn"));
  assert.ok(commands.prefixCommands.has("warn"));
});

test("the handlers run the matching slash and prefix command", async () => {
  const replies = [];
  const command = {
    executeSlash: async () => replies.push("slash"),
    executePrefix: async (_message, args) => replies.push(args.join(",")),
  };

  await interactionCreate.execute(
    {
      isChatInputCommand: () => true,
      commandName: "ping",
      user: { id: "123" },
    },
    {
      slashCommands: new Map([["ping", command]]),
      xpStats: { recordActivity: async () => {} },
    },
  );

  await messageCreate.execute(
    {
      inGuild: () => true,
      author: { bot: false },
      content: "!ping now",
    },
    {
      prefixCommands: new Map([["ping", command]]),
      prefixes: ["!", ","],
      xpStats: { recordActivity: async () => {} },
    },
  );

  assert.deepEqual(replies, ["slash", "now"]);
});
