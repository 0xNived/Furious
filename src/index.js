import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing. Add it to your .env file before starting Onion.");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Onion is online as ${readyClient.user.tag}.`);
});

const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down Onion.`);
  client.destroy();
  process.exit(0);
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

try {
  await client.login(token);
} catch (error) {
  console.error("Onion could not log in. Check BOT_TOKEN and Discord Developer Portal settings.");
  console.error(error);
  process.exitCode = 1;
}
