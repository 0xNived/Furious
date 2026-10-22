import "dotenv/config";
import { REST, Routes } from "discord.js";
import { loadCommands } from "../handlers/commands.js";
import { logger } from "../logging/logger.js";

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  throw new Error("BOT_TOKEN and CLIENT_ID are required to register slash commands.");
}

const { slashCommands } = await loadCommands(
  new URL("../commands/", import.meta.url),
);
const commands = [...slashCommands.values()].map((command) => command.data.toJSON());
const rest = new REST().setToken(token);
const route = guildId
  ? Routes.applicationGuildCommands(clientId, guildId)
  : Routes.applicationCommands(clientId);

await rest.put(route, { body: commands });

logger.info(
  `Registered ${commands.length} slash command${commands.length === 1 ? "" : "s"}${
    guildId ? " in the development server." : " globally."
  }`,
);
