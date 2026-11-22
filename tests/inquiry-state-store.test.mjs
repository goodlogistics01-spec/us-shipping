import assert from "node:assert/strict";
import test from "node:test";

import {
  createMemoryInquiryStateStore,
  createUpstashInquiryStateStore
} from "../app/lib/inquiry-state-store.mjs";

const CLAIM = {
  key: "inq-test-key",
  fingerprint: "fingerprint-a",
  submissionId: "GL-20261122-STATE0001",
  ownerToken: "owner-a",
  nowMs: 1_000,
  ttlMs: 86_400_000
};

test("two memory-store instances atomically share one claim and replay its stored outcome", async () => {
  const idempotencyStore = new Map();
  const first = createMemoryInquiryStateStore({ idempotencyStore });
  const second = createMemoryInquiryStateStore({ idempotencyStore });
  const [firstClaim, secondClaim] = await Promise.all([
    first.claim(CLAIM),
    second.claim({ ...CLAIM, ownerToken: "owner-b" })
  ]);

  assert.deepEqual(
    new Set([firstClaim.status, secondClaim.status]),
    new Set(["CLAIMED", "PROCESSING"])
  );
  const owner = firstClaim.status === "CLAIMED" ? first : second;
  const ownerToken = firstClaim.status === "CLAIMED" ? "owner-a" : "owner-b";
  const outcome = {
    submissionStatus: "SUCCESS",
    code: "PROVIDER_ACCEPTED",
    submissionId: CLAIM.submissionId
  };
  assert.equal((await owner.complete({
    ...CLAIM,
    ownerToken,
    outcome,
    nowMs: 2_000
  })).status, "STORED");

  const restarted = createMemoryInquiryStateStore({ idempotencyStore });
  const replay = await restarted.claim({ ...CLAIM, nowMs: 3_000 });
  assert.equal(replay.status, "REPLAY");
  assert.deepEqual(replay.outcome, outcome);
});

test("a captured CRM outcome is replayable before notification metadata is finalized", async () => {
  const idempotencyStore = new Map();
  const store = createMemoryInquiryStateStore({ idempotencyStore });
  assert.equal((await store.claim(CLAIM)).status, "CLAIMED");

  const capturedOutcome = {
    submissionStatus: "SUCCESS",
    code: "CRM_ACCEPTED",
    submissionId: CLAIM.submissionId,
    leadStoreStatus: "SUCCESS",
    notificationStatus: "PENDING"
  };
  assert.equal((await store.capture({
    ...CLAIM,
    outcome: capturedOutcome,
    nowMs: 1_500
  })).status, "STORED");

  const replay = await store.claim({ ...CLAIM, ownerToken: "other", nowMs: 1_600 });
  assert.equal(replay.status, "REPLAY");
  assert.deepEqual(replay.outcome, capturedOutcome);

  const finalOutcome = {
    ...capturedOutcome,
    code: "CRM_ACCEPTED_NOTIFICATION_SENT",
    notificationStatus: "SUCCESS"
  };
  assert.equal((await store.complete({
    ...CLAIM,
    outcome: finalOutcome,
    nowMs: 1_700
  })).status, "STORED");
  const finalReplay = await store.claim({ ...CLAIM, nowMs: 1_800 });
  assert.deepEqual(finalReplay.outcome, finalOutcome);
});

test("memory rate-limit expiry keeps newer timestamps when the oldest leaves the window", async () => {
  const rateLimitStore = new Map();
  const store = createMemoryInquiryStateStore({ rateLimitStore });
  const base = {
    key: "hashed-ip",
    windowMs: 600_000,
    max: 2
  };

  assert.equal((await store.checkRateLimit({ ...base, member: "a", nowMs: 0 })).limited, false);
  assert.equal((await store.checkRateLimit({ ...base, member: "b", nowMs: 300_000 })).limited, false);
  assert.equal((await store.checkRateLimit({ ...base, member: "c", nowMs: 600_001 })).limited, false);
  assert.equal((await store.checkRateLimit({ ...base, member: "d", nowMs: 600_002 })).limited, true);
});

test("Upstash adapter sends atomic EVAL commands for claim, capture, complete, and rate limiting", async () => {
  const commands = [];
  const store = createUpstashInquiryStateStore({
    url: "https://example.upstash.io",
    token: "test-token",
    fetchImpl: async (_url, options) => {
      const command = JSON.parse(options.body);
      commands.push(command);
      if (commands.length === 1) {
        return new Response(JSON.stringify({ result: ["CLAIMED", command[4]] }), {
          headers: { "content-type": "application/json" }
        });
      }
      if (commands.length === 2 || commands.length === 3) {
        return new Response(JSON.stringify({ result: ["STORED"] }), {
          headers: { "content-type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ result: [0, 0] }), {
        headers: { "content-type": "application/json" }
      });
    }
  });

  assert.equal((await store.claim(CLAIM)).status, "CLAIMED");
  assert.equal((await store.capture({
    ...CLAIM,
    outcome: {
      submissionStatus: "SUCCESS",
      code: "CRM_ACCEPTED",
      submissionId: CLAIM.submissionId,
      notificationStatus: "PENDING"
    }
  })).status, "STORED");
  assert.equal((await store.complete({
    ...CLAIM,
    outcome: {
      submissionStatus: "SUCCESS",
      code: "PROVIDER_ACCEPTED",
      submissionId: CLAIM.submissionId
    }
  })).status, "STORED");
  assert.equal((await store.checkRateLimit({
    key: "hashed-ip",
    member: "member-a",
    nowMs: 1_000,
    windowMs: 600_000,
    max: 5
  })).limited, false);

  assert.equal(commands.length, 4);
  assert.ok(commands.every((command) => command[0] === "EVAL"));
  assert.ok(commands.every((command) => command[2] === 1));
});

test("Upstash adapter rejects HTTP, JSON, and network failures without falling back", async () => {
  const failures = [
    async () => new Response("unavailable", { status: 503 }),
    async () => new Response("not-json", { status: 200 }),
    async () => new Response(JSON.stringify({ error: "mock error" }), { status: 200 }),
    async () => {
      throw new TypeError("mock network failure");
    }
  ];

  for (const fetchImpl of failures) {
    const store = createUpstashInquiryStateStore({
      url: "https://example.upstash.io",
      token: "test-token",
      fetchImpl
    });
    await assert.rejects(
      () => store.claim(CLAIM),
      (error) => [
        "STATE_STORE_UNAVAILABLE",
        "STATE_STORE_RESPONSE_INVALID"
      ].includes(error.code)
    );
  }
});

test("Upstash configuration rejects non-HTTPS endpoints", () => {
  assert.throws(
    () => createUpstashInquiryStateStore({
      url: "http://127.0.0.1:6379",
      token: "test-token"
    }),
    (error) => error.code === "STATE_STORE_CONFIGURATION_ERROR"
  );
});
