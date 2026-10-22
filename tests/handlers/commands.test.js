import test from "node:test";
import assert from "node:assert/strict";
import { loadCommands } from "../../src/handlers/commands.js";
import interactionCreate from "../../src/events/interaction-create.js";
import messageCreate from "../../src/events/message-create.js";

test("the command loader finds slash and prefix commands in categories", async () => {
  const commands = await loadCommands(new URL("../../src/commands/", import.meta.url));

  assert.ok(commands.slashCommands.has("ping"));
  assert.ok(commands.prefixCommands.has("ping"));
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
    },
    { slashCommands: new Map([["ping", command]]) },
  );

  await messageCreate.execute(
    {
      inGuild: () => true,
      author: { bot: false },
      content: "!ping now",
    },
    { prefixCommands: new Map([["ping", command]]), prefix: "!" },
  );

  assert.deepEqual(replies, ["slash", "now"]);
});
