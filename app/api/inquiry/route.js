import { handleInquiryRequest } from "../../lib/inquiry-endpoint.mjs";
import {
  createInquiryResponseAuditEvent,
  emitInquiryAudit
} from "../../lib/inquiry-audit.mjs";

export const runtime = "nodejs";
export const maxDuration = 30;

function writeAuditEvent(event) {
  console.info("[gdlogi-inquiry]", JSON.stringify(event));
}

export async function POST(request) {
  const response = await handleInquiryRequest(request, {
    auditLogger: writeAuditEvent
  });
  let body;
  try {
    body = await response.clone().json();
  } catch {
    body = undefined;
  }
  emitInquiryAudit(
    writeAuditEvent,
    createInquiryResponseAuditEvent(body, response.status, {
      environment: process.env.VERCEL_ENV
    })
  );
  return response;
}
