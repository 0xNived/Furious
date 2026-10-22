import { desc, eq, sql } from "drizzle-orm";
import { getDatabase } from "../client.js";
import { snipeHistory } from "../schema/index.js";

export async function saveSnipedMessage(deletedMessage, requesterId) {
  const database = getDatabase();
  const savedMessage = await database.transaction(async (transaction) => {
    const [historyEntry] = await transaction
      .insert(snipeHistory)
      .values({ ...deletedMessage, requesterId })
      .onConflictDoNothing({ target: snipeHistory.messageId })
      .returning({ id: snipeHistory.id });

    if (!historyEntry) return false;

    await transaction.execute(sql`
      delete from snipe_history
      where id in (
        select id from snipe_history
        where requester_id = ${requesterId}
        order by sniped_at desc, id desc
        offset 10
      )
    `);

    return true;
  });

  return Boolean(savedMessage);
}

export async function getPersonalSnipeHistory(requesterId) {
  const database = getDatabase();
  return database
    .select()
    .from(snipeHistory)
    .where(eq(snipeHistory.requesterId, requesterId))
    .orderBy(desc(snipeHistory.snipedAt), desc(snipeHistory.id))
    .limit(10);
}

export const snipedMessages = { history: getPersonalSnipeHistory, save: saveSnipedMessage };
