import { readdir } from "node:fs/promises";

/** Load every command inside `src/commands/<category>/`. */
export async function loadCommands(directory) {
  const slashCommands = new Map();
  const prefixCommands = new Map();

  for (const file of await findCommandFiles(directory)) {
    const { default: command } = await import(file.href);
    validateCommand(command, file.pathname);

    if (command.data) {
      const { name } = command.data.toJSON();
      if (slashCommands.has(name)) {
        throw new Error(`Duplicate slash command name: ${name}.`);
      }
      slashCommands.set(name, command);
    }

    for (const alias of command.prefixAliases ?? []) {
      const name = alias.toLowerCase();
      if (prefixCommands.has(name)) {
        throw new Error(`Duplicate prefix command name: ${name}.`);
      }
      prefixCommands.set(name, command);
    }
  }

  return { slashCommands, prefixCommands };
}

async function findCommandFiles(directory) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      files.push(...(await findCommandFiles(new URL(`${entry.name}/`, directory))));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(new URL(entry.name, directory));
    }
  }

  return files;
}

function validateCommand(command, file) {
  if (!command || typeof command !== "object") {
    throw new Error(`Command ${file} must export a default command object.`);
  }
  if (command.data && typeof command.executeSlash !== "function") {
    throw new Error(`Slash command ${file} needs executeSlash().`);
  }
  if (command.prefixAliases && typeof command.executePrefix !== "function") {
    throw new Error(`Prefix command ${file} needs executePrefix().`);
  }
  if (!command.data && !command.prefixAliases) {
    throw new Error(`Command ${file} needs slash data or prefixAliases.`);
  }
}
