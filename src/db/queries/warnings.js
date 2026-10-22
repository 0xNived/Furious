import { getDatabase } from "../client.js";
import { warnings } from "../schema/index.js";

export async function addWarning(warning) {
  const database = getDatabase();
  const [savedWarning] = await database.insert(warnings).values(warning).returning({ id: warnings.id });
  return savedWarning;
}

export const warningData = { add: addWarning };
