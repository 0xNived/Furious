import test from "node:test";
import assert from "node:assert/strict";
import { findUsedInvite, syncInvites } from "../../src/discord/invite-tracker.js";

test("invite tracker detects an increased invite use count", async () => {
  const invites = [{ code: "onion", uses: 4, inviterId: "inviter" }];
  const guild = {
    id: "invite-tracker-test",
    invites: { fetch: async () => new Map(invites.map((invite) => [invite.code, invite])) },
  };

  await syncInvites(guild);
  invites[0] = { ...invites[0], uses: 5 };

  assert.deepEqual(await findUsedInvite(guild), {
    code: "onion",
    uses: 5,
    inviterId: "inviter",
  });
});
