import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { logger } from "./logging/logger.js";
import { loadCommands } from "./handlers/commands.js";
import { registerEvents } from "./handlers/events.js";

const token = process.env.BOT_TOKEN;
const prefix = process.env.COMMAND_PREFIX ?? "!";

if (!token) {
  logger.error("BOT_TOKEN is missing. Add it to your .env file before starting Onion.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const { slashCommands, prefixCommands } = await loadCommands(
  new URL("./commands/", import.meta.url),
);

await registerEvents(client, { slashCommands, prefixCommands, prefix });

const shutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down Onion.`);
  client.destroy();
  process.exit(0);
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

try {
  await client.login(token);
} catch (error) {
  logger.error(
    "Onion could not log in. Check BOT_TOKEN and Discord Developer Portal settings.",
    error,
  );
  process.exitCode = 1;
}
