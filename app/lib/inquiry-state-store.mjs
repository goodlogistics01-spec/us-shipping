export const INQUIRY_STATE_STORE_TIMEOUT_MS = 3_000;
const DEFAULT_NAMESPACE = "gdlogi:inquiry";

const CLAIM_SCRIPT = `
local current = redis.call('GET', KEYS[1])
if not current then
  redis.call('SET', KEYS[1], ARGV[1], 'PX', ARGV[2])
  return {'CLAIMED', ARGV[1]}
end
local record = cjson.decode(current)
if record.fingerprint ~= ARGV[3] then
  return {'CONFLICT', current}
end
if record.state == 'PROCESSING' then
  return {'PROCESSING', current}
end
return {'REPLAY', current}
`;

const COMPLETE_SCRIPT = `
local current = redis.call('GET', KEYS[1])
if not current then
  return {'MISSING'}
end
local record = cjson.decode(current)
if record.fingerprint ~= ARGV[1] then
  return {'FINGERPRINT_MISMATCH'}
end
if record.ownerToken ~= ARGV[2] then
  return {'OWNER_MISMATCH'}
end
if record.state ~= 'PROCESSING' and record.state ~= 'CAPTURED' then
  return {'ALREADY_COMPLETE', current}
end
redis.call('SET', KEYS[1], ARGV[3], 'PX', ARGV[4])
return {'STORED'}
`;

const CAPTURE_SCRIPT = `
local current = redis.call('GET', KEYS[1])
if not current then
  return {'MISSING'}
end
local record = cjson.decode(current)
if record.fingerprint ~= ARGV[1] then
  return {'FINGERPRINT_MISMATCH'}
end
if record.ownerToken ~= ARGV[2] then
  return {'OWNER_MISMATCH'}
end
if record.state ~= 'PROCESSING' then
  return {'ALREADY_CAPTURED', current}
end
redis.call('SET', KEYS[1], ARGV[3], 'PX', ARGV[4])
return {'STORED'}
`;

const RATE_LIMIT_SCRIPT = `
local cutoff = tonumber(ARGV[1]) - tonumber(ARGV[2])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', cutoff)
local count = redis.call('ZCARD', KEYS[1])
if count >= tonumber(ARGV[3]) then
  local oldest = redis.call('ZRANGE', KEYS[1], 0, 0, 'WITHSCORES')
  local retry = tonumber(ARGV[2])
  if oldest[2] then
    retry = tonumber(ARGV[2]) - (tonumber(ARGV[1]) - tonumber(oldest[2]))
  end
  if retry < 1 then retry = 1 end
  return {1, retry}
end
redis.call('ZADD', KEYS[1], 'NX', ARGV[1], ARGV[4])
redis.call('PEXPIRE', KEYS[1], ARGV[2])
return {0, 0}
`;

export class InquiryStateStoreError extends Error {
  constructor(code, cause) {
    super(code, cause ? { cause } : undefined);
    this.name = "InquiryStateStoreError";
    this.code = code;
  }
}
function activeMemoryRecord(store, key, nowMs) {
  const record = store.get(key);
  if (record && record.expiresAt <= nowMs) {
    store.delete(key);
    return null;
  }
  return record || null;
}

export function createMemoryInquiryStateStore({
  idempotencyStore = new Map(),
  rateLimitStore = new Map()
} = {}) {
  return {
    kind: "memory",
    async claim({ key, fingerprint, submissionId, ownerToken, nowMs, ttlMs }) {
      const existing = activeMemoryRecord(idempotencyStore, key, nowMs);
      if (existing) {
        if (existing.fingerprint !== fingerprint) {
          return { status: "CONFLICT", submissionId: existing.submissionId };
        }
        if (existing.state === "PROCESSING") {
          return { status: "PROCESSING", submissionId: existing.submissionId };
        }
        return {
          status: "REPLAY",
          submissionId: existing.submissionId,
          outcome: existing.outcome
        };
      }

      idempotencyStore.set(key, {
        fingerprint,
        submissionId,
        ownerToken,
        state: "PROCESSING",
        expiresAt: nowMs + ttlMs
      });
      return { status: "CLAIMED", submissionId };
    },

    async complete({ key, fingerprint, ownerToken, outcome, nowMs, ttlMs }) {
      const existing = activeMemoryRecord(idempotencyStore, key, nowMs);
      if (!existing) return { status: "MISSING" };
      if (existing.fingerprint !== fingerprint) return { status: "FINGERPRINT_MISMATCH" };
      if (existing.ownerToken !== ownerToken) return { status: "OWNER_MISMATCH" };
      if (!["PROCESSING", "CAPTURED"].includes(existing.state)) {
        return { status: "ALREADY_COMPLETE" };
      }

      idempotencyStore.set(key, {
        fingerprint,
        submissionId: existing.submissionId,
        ownerToken,
        state: outcome.submissionStatus,
        outcome,
        expiresAt: nowMs + ttlMs
      });
      return { status: "STORED" };
    },

    async capture({ key, fingerprint, ownerToken, outcome, nowMs, ttlMs }) {
      const existing = activeMemoryRecord(idempotencyStore, key, nowMs);
      if (!existing) return { status: "MISSING" };
      if (existing.fingerprint !== fingerprint) return { status: "FINGERPRINT_MISMATCH" };
      if (existing.ownerToken !== ownerToken) return { status: "OWNER_MISMATCH" };
      if (existing.state !== "PROCESSING") return { status: "ALREADY_CAPTURED" };

      idempotencyStore.set(key, {
        fingerprint,
        submissionId: existing.submissionId,
        ownerToken,
        state: "CAPTURED",
        outcome,
        expiresAt: nowMs + ttlMs
      });
      return { status: "STORED" };
    },

    async checkRateLimit({ key, member, nowMs, windowMs, max }) {
      const existing = activeMemoryRecord(rateLimitStore, key, nowMs);
      const timestamps = (existing?.timestamps || []).filter(
        (timestamp) => nowMs - timestamp < windowMs
      );
      if (timestamps.length >= max) {
        const retryAfterMs = Math.max(1, windowMs - (nowMs - timestamps[0]));
        rateLimitStore.set(key, {
          timestamps,
          expiresAt: timestamps[timestamps.length - 1] + windowMs
        });
        return { limited: true, retryAfterMs };
      }

      timestamps.push(nowMs);
      rateLimitStore.set(key, {
        timestamps,
        expiresAt: timestamps[timestamps.length - 1] + windowMs,
        members: [...(existing?.members || []), member]
      });
      return { limited: false, retryAfterMs: 0 };
    }
  };
}
function validateUpstashUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname.endsWith(".localhost")
    ) {
      return null;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function parseRecord(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new InquiryStateStoreError("STATE_STORE_RESPONSE_INVALID", error);
  }
}

export function createUpstashInquiryStateStore({
  url,
  token,
  namespace = DEFAULT_NAMESPACE,
  fetchImpl = fetch,
  timeoutMs = INQUIRY_STATE_STORE_TIMEOUT_MS
}) {
  const endpoint = validateUpstashUrl(url);
  if (!endpoint || !token || !/^[a-zA-Z0-9:_-]{1,80}$/.test(namespace)) {
    throw new InquiryStateStoreError("STATE_STORE_CONFIGURATION_ERROR");
  }

  async function command(parts) {
    let response;
    try {
      response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parts),
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (error) {
      throw new InquiryStateStoreError("STATE_STORE_UNAVAILABLE", error);
    }
    if (!response.ok) {
      throw new InquiryStateStoreError("STATE_STORE_UNAVAILABLE");
    }

    let body;
    try {
      body = await response.json();
    } catch (error) {
      throw new InquiryStateStoreError("STATE_STORE_RESPONSE_INVALID", error);
    }
    if (!body || body.error || !("result" in body)) {
      throw new InquiryStateStoreError("STATE_STORE_RESPONSE_INVALID");
    }
    return body.result;
  }

  const idempotencyKey = (key) => `${namespace}:idempotency:${key}`;
  const rateLimitKey = (key) => `${namespace}:rate:${key}`;

  return {
    kind: "upstash-redis",
    async claim({ key, fingerprint, submissionId, ownerToken, nowMs, ttlMs }) {
      const record = JSON.stringify({
        v: 1,
        fingerprint,
        submissionId,
        ownerToken,
        state: "PROCESSING",
        createdAt: nowMs,
        updatedAt: nowMs
      });
      const result = await command([
        "EVAL",
        CLAIM_SCRIPT,
        1,
        idempotencyKey(key),
        record,
        ttlMs,
        fingerprint
      ]);
      if (!Array.isArray(result) || !result[0]) {
        throw new InquiryStateStoreError("STATE_STORE_RESPONSE_INVALID");
      }
      const status = String(result[0]);
      const existing = result[1] ? parseRecord(result[1]) : null;
      return {
        status,
        submissionId: existing?.submissionId || submissionId,
        ...(status === "REPLAY" ? { outcome: existing?.outcome } : {})
      };
    },

    async complete({ key, fingerprint, ownerToken, outcome, nowMs, ttlMs }) {
      const record = JSON.stringify({
        v: 1,
        fingerprint,
        submissionId: outcome.submissionId,
        ownerToken,
        state: outcome.submissionStatus,
        outcome,
        updatedAt: nowMs
      });
      const result = await command([
        "EVAL",
        COMPLETE_SCRIPT,
        1,
        idempotencyKey(key),
        fingerprint,
        ownerToken,
        record,
        ttlMs
      ]);
      if (!Array.isArray(result) || !result[0]) {
        throw new InquiryStateStoreError("STATE_STORE_RESPONSE_INVALID");
      }
      return { status: String(result[0]) };
    },

    async capture({ key, fingerprint, ownerToken, outcome, nowMs, ttlMs }) {
      const record = JSON.stringify({
        v: 1,
        fingerprint,
        submissionId: outcome.submissionId,
        ownerToken,
        state: "CAPTURED",
        outcome,
        updatedAt: nowMs
      });
      const result = await command([
        "EVAL",
        CAPTURE_SCRIPT,
        1,
        idempotencyKey(key),
        fingerprint,
        ownerToken,
        record,
        ttlMs
      ]);
      if (!Array.isArray(result) || !result[0]) {
        throw new InquiryStateStoreError("STATE_STORE_RESPONSE_INVALID");
      }
      return { status: String(result[0]) };
    },

    async checkRateLimit({ key, member, nowMs, windowMs, max }) {
      const result = await command([
        "EVAL",
        RATE_LIMIT_SCRIPT,
        1,
        rateLimitKey(key),
        nowMs,
        windowMs,
        max,
        member
      ]);
      if (!Array.isArray(result) || result.length < 2) {
        throw new InquiryStateStoreError("STATE_STORE_RESPONSE_INVALID");
      }
      return {
        limited: Number(result[0]) === 1,
        retryAfterMs: Math.max(0, Number(result[1]) || 0)
      };
    }
  };
}
