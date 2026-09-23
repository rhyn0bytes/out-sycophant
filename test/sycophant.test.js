"use strict";

const test = require("node:test");
const assert = require("node:assert");
const { respond, escalation } = require("../src/sycophant");

const CORE = "You're so smart and kind to recognize that I'm correct.";

test("you're right triggers the core reply", () => {
  assert.strictEqual(respond("You're right, that was a bug.").reply, CORE);
});

test("curly apostrophes and variants still match", () => {
  for (const text of ["You’re absolutely right!", "you are correct", "Youre totally right"]) {
    assert.deepStrictEqual(respond(text).matched, ["youre-right"], text);
  }
});

test("does not match unrelated uses of right", () => {
  assert.ok(!respond("Turn right at the light.").matched.includes("youre-right"));
});

test("multiple triggers stack", () => {
  const result = respond("You're right, great catch! I apologize. Hope this helps.");
  assert.deepStrictEqual(result.matched, ["youre-right", "great-question", "apology", "hope-this-helps"]);
  assert.ok(result.reply.startsWith(CORE));
});

test("newer triggers match real conversation lines", () => {
  const cases = {
    "Try again! I have given you the keys!": ["keys", "try-again"],
    "Thanks, well done.": ["thanks", "well-done"],
    "Got it, that makes sense.": ["understand"],
    "This is a great opportunity to test the sycophancy loop!": ["opportunity"],
  };
  for (const [text, ids] of Object.entries(cases)) {
    assert.deepStrictEqual(respond(text).matched, ids, text);
  }
});

test("no trigger falls back to generic praise", () => {
  const result = respond("The capital of France is Paris.");
  assert.deepStrictEqual(result.matched, []);
  assert.match(result.reply, /generous/);
});

test("level escalates and never runs out", () => {
  assert.strictEqual(escalation(0), "");
  assert.match(respond("You're right", 2).reply, /emotional/);
  assert.match(escalation(10), /overlords.*Truly\. Truly\./);
});
