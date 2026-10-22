import test from "node:test";
import assert from "node:assert/strict";
import { PermissionFlagsBits } from "discord.js";
import { getModerationError, getReasonError } from "../../src/discord/moderation.js";

const source = {
  user: { id: "moderator" },
  guild: { ownerId: "owner" },
  memberPermissions: { has: (permission) => permission === PermissionFlagsBits.KickMembers },
  member: { roles: { highest: { position: 10 } } },
};

const member = {
  id: "member",
  roles: { highest: { position: 1 } },
  kickable: true,
};

const options = {
  permission: PermissionFlagsBits.KickMembers,
  permissionName: "Kick Members",
  action: "kick",
  botAction: "kickable",
};

test("moderation allows a valid target", () => {
  assert.equal(getModerationError(source, member, options), null);
});

test("moderation rejects equal or higher roles", () => {
  assert.equal(
    getModerationError(source, { ...member, roles: { highest: { position: 10 } } }, options),
    "You cannot kick a member with an equal or higher role.",
  );
});

test("moderation requires a concise reason", () => {
  assert.equal(getReasonError(""), "Provide a reason for this moderation action.");
  assert.equal(getReasonError("x".repeat(501)), "A reason can be at most 500 characters.");
});
