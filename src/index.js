import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { closeDatabase } from "./db/client.js";
import { guildData } from "./db/queries/guilds.js";
import { pingStats } from "./db/queries/pings.js";
import { snipedMessages } from "./db/queries/snipe-history.js";
import { xpStats } from "./db/queries/xp.js";
import { snipeCache } from "./discord/snipe-cache.js";
import { inviteTracker } from "./discord/invite-tracker.js";
import { logger } from "./logging/logger.js";
import { loadCommands } from "./handlers/commands.js";
import { registerEvents } from "./handlers/events.js";

const token = process.env.BOT_TOKEN;
const prefixes = [...new Set([process.env.COMMAND_PREFIX ?? "!", ","])];

if (!token) {
  logger.error("BOT_TOKEN is missing. Add it to your .env file before starting Onion.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  logger.error("DATABASE_URL is missing. Add it to your .env file before starting Onion.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const { slashCommands, prefixCommands } = await loadCommands(
  new URL("./commands/", import.meta.url),
);

await registerEvents(client, {
  slashCommands,
  prefixCommands,
  prefixes,
  pingStats,
  guildData,
  inviteTracker,
  snipeCache,
  snipedMessages,
  xpStats,
});

const shutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down Onion.`);
  client.destroy();
  await closeDatabase();
  process.exit(0);
};

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

try {
  await client.login(token);
} catch (error) {
  logger.error(
    "Onion could not log in. Check BOT_TOKEN and Discord Developer Portal settings.",
    error,
  );
  process.exitCode = 1;
}
