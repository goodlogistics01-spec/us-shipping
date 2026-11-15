# Private inquiry follow-up record

Use this structure in the company's existing private spreadsheet or CRM after an inquiry reaches the company inbox. It is an operating method only; this repository does not store customer inquiries and does not claim a durable CRM integration.

## Minimum columns

| Field | Purpose |
| --- | --- |
| `submission_id` | Match the website response, provider message and any investigation without using contact data in analytics |
| `received_at` | Inbox receipt time in one agreed timezone |
| `provider_status` | `SUCCESS`, `FAILED` or `PENDING` as returned by the website provider call |
| `inbox_receipt` | `confirmed`, `not found` or `not checked`; provider acceptance alone is not receipt confirmation |
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

- `SUCCESS` means the upstream provider explicitly accepted one request. It does not by itself prove inbox delivery, field completeness or reply delivery.
- `PENDING` must not be automatically resent. Check the inbox and provider state using the `submission_id` before deciding on any manual action.
- `FAILED` may be retried after a correctable field or configuration issue is fixed. A new cargo inquiry from the same email or IP must not be rejected merely because an earlier inquiry exists.
- `inbox_receipt=confirmed` requires an actual message in the company inbox with the expected `submission_id`.
- A valid Reply-To check requires the reply composer to address the controlled submitter mailbox; end-to-end reply delivery is a separate manual confirmation.

## Measurement boundary

Website analytics may receive anonymous event names, form/source labels, allowlisted service selections and result categories. It must not receive names, email addresses, phone numbers, full URLs with queries, free-text cargo descriptions, private quote values or sales outcomes tied to a person.

Review valid inquiries, quotations and outcomes after 7, 30 and 60 days. Small samples should be reported as observations, not proof that a specific layout caused growth.
