import { createServer } from "node:http";

const hostname = "127.0.0.1";
const port = Number(process.env.GDLOGI_MOCK_PROVIDER_PORT || 3218);
const allowedModes = new Set(["success", "failed", "pending", "ambiguous"]);
let mode = allowedModes.has(process.env.GDLOGI_MOCK_PROVIDER_MODE)
  ? process.env.GDLOGI_MOCK_PROVIDER_MODE
  : "success";
let requestCount = 0;
let lastPayload = null;

function sendJson(response, status, body) {
  response.writeHead(status, {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${hostname}:${port}`);

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, { ok: true, mode });
    return;
  }

  if (request.method === "GET" && url.pathname === "/__state") {
    sendJson(response, 200, { ok: true, mode, request_count: requestCount, last_payload: lastPayload });
    return;
  }

  if (request.method === "POST" && url.pathname.startsWith("/__mode/")) {
    const nextMode = url.pathname.slice("/__mode/".length);
    if (!allowedModes.has(nextMode)) {
      sendJson(response, 400, { ok: false, allowed_modes: [...allowedModes] });
      return;
    }
    mode = nextMode;
    sendJson(response, 200, { ok: true, mode });
    return;
  }

  if (request.method !== "POST" || url.pathname !== "/mock") {
    sendJson(response, 404, { ok: false, error: "Not found" });
    return;
  }

  try {
    lastPayload = await readJson(request);
    requestCount += 1;
  } catch {
    sendJson(response, 400, { success: false, error: "Invalid JSON" });
    return;
  }

  if (mode === "failed") {
    sendJson(response, 422, { success: false, error: "Controlled mock rejection" });
    return;
  }
  if (mode === "pending") {
    sendJson(response, 202, { accepted: true, status: "processing" });
    return;
  }
  if (mode === "ambiguous") {
    sendJson(response, 200, { message: "Controlled ambiguous response" });
    return;
  }
  sendJson(response, 200, { success: true });
});

server.listen(port, hostname, () => {
  console.log(`GDLOGI mock inquiry provider listening on http://${hostname}:${port}/mock (${mode})`);
});

function close() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", close);
process.on("SIGTERM", close);
