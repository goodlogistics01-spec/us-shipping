# Private inquiry follow-up record

Use this structure in the designated private CRM and follow-up process. In the HubSpot + Resend candidate, HubSpot is the primary inquiry record and Resend is a separate inbox notification. This repository contains the integration code but stores no customer inquiry records itself. Production activation remains `NOT_VERIFIED` until the configured deployment passes the controlled test.

## Minimum columns

| Field | Purpose |
| --- | --- |
| `submission_id` | Match the website response, provider message and any investigation without using contact data in analytics |
| `received_at` | Inbox receipt time in one agreed timezone |
| `provider_status` | Overall `SUCCESS`, `FAILED` or `PENDING` returned by the website |
| `crm_storage_status` | Whether HubSpot explicitly accepted the record, rejected it or remained uncertain |
| `crm_record_id` | Non-sensitive Provider record/request identifier when returned; keep the website `submission_id` as the primary reconciliation key |
| `crm_accepted_at` | Time the CRM acceptance was confirmed |
| `notification_status` | Resend `SUCCESS`, `FAILED`, `PENDING` or `NOT_ATTEMPTED`; this is separate from CRM storage |
| `notification_message_id` | Resend message identifier when explicitly returned; it is not proof of inbox delivery |
| `inbox_receipt` | `confirmed`, `not found` or `not checked`; provider acceptance alone is not receipt confirmation |
| `inbox_received_at` | Actual inbox receipt time when manually confirmed |
| `source_page` | Identify the service, resource or quote page that started the inquiry |
| `utm_source`, `utm_medium`, `utm_campaign` | Record only the allowlisted attribution fields delivered in the message |
| `contact_name`, `company`, `email`, `whatsapp` | Sales follow-up details; keep private and out of public analytics |
| `product_name` | The goods or product requested |
| `origin`, `destination` | Supplier/pickup and final delivery context |
| `shipping_method` | Ocean, air, express or not yet decided |
| `service_needs` | All selected operations, not only the first service |
| `inspection_types` | Receiving checks, product-quality inspection or scope not specified |
| `weight`, `volume`, `package_count`, `dimensions`, `cargo_ready_date` | Available shipment data; blanks mean follow-up is needed |
| `lead_stage` | `new`, `valid requirement`, `quoted`, `won`, `lost` or `not a fit` |
| `next_action`, `owner`, `next_action_date` | Prevent valid inquiries from being left without follow-up |
| `quote_reference` | Link the inquiry to the internal quotation record |
| `outcome_note` | Short reason for win, loss or disqualification; do not copy sensitive customer documents into analytics |

## Status rules

- In the HubSpot + Resend candidate, `SUCCESS` means HubSpot explicitly accepted the inquiry record. It does not prove Resend delivery, inbox receipt, field completeness or reply delivery.
- `PENDING` must not be automatically resent. Check the inbox and provider state using the `submission_id` before deciding on any manual action.
- `FAILED` may be retried after a correctable field or configuration issue is fixed. A new cargo inquiry from the same email or IP must not be rejected merely because an earlier inquiry exists.
- A Resend failure after CRM acceptance does not change the customer-facing result back to `FAILED`; recover the inquiry from HubSpot and investigate notification separately.
- `inbox_receipt=confirmed` requires an actual message in the company inbox with the expected `submission_id`.
- A valid Reply-To check requires the reply composer to address the controlled submitter mailbox; end-to-end reply delivery is a separate manual confirmation.

## Measurement boundary

Website analytics may receive anonymous event names, form/source labels, allowlisted service selections and result categories. It must not receive names, email addresses, phone numbers, full URLs with queries, free-text cargo descriptions, private quote values or sales outcomes tied to a person.

Review valid inquiries, quotations and outcomes after 7, 30 and 60 days. Small samples should be reported as observations, not proof that a specific layout caused growth.
