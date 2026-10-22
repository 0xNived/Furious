import { readdir } from "node:fs/promises";

/** Load and connect every event module in `src/events/`. */
export async function registerEvents(client, context) {
  const directory = new URL("../events/", import.meta.url);
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".js")) continue;

    const { default: event } = await import(new URL(entry.name, directory).href);
    validateEvent(event, entry.name);

    const listener = (...args) => event.execute(...args, context);
    client[event.once ? "once" : "on"](event.name, listener);
  }
}

function validateEvent(event, file) {
  if (!event?.name || typeof event.execute !== "function") {
    throw new Error(`Event ${file} needs a name and execute() function.`);
  }
}
