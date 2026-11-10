import { handleInquiryRequest } from "../../lib/inquiry-endpoint.mjs";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request) {
  return handleInquiryRequest(request);
}
