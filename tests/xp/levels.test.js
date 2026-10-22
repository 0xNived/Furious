import test from "node:test";
import assert from "node:assert/strict";
import { getLevelProgress } from "../../src/xp/levels.js";

test("level one starts at zero XP and needs 15 XP", () => {
  assert.deepEqual(getLevelProgress(0), {
    level: 1,
    currentXp: 0,
    neededXp: 15,
    percentage: 0,
  });
});

test("level progress advances at the XP threshold", () => {
  assert.deepEqual(getLevelProgress(15), {
    level: 2,
    currentXp: 0,
    neededXp: 45,
    percentage: 0,
  });
});
