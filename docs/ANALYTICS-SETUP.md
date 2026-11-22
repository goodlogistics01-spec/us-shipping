# Analytics setup

The site emits anonymous `dataLayer` events without loading a third-party tag by default. No analytics ID is hard-coded.

Current release status: no production `GTM_CONTAINER_ID` or completed consent UI is recorded in the repository, so external GTM/GA collection remains disabled and unverified. Do not report that the site is collecting analytics until both configuration and consent behavior have been approved and tested.

## Configuration

1. Set `GTM_CONTAINER_ID` to a valid `GTM-...` container ID in the deployment environment.
2. Connect the site's consent control to the event below. Google Tag Manager loads only after `granted` consent is stored.

```js
window.dispatchEvent(
  new CustomEvent("gdlogi:analytics-consent", {
    detail: { status: "granted" } // or "denied"
  })
);
```

Until both a valid ID and `granted` consent exist, no Google script is requested. The choice is stored as `gdlogi_analytics_consent` in local storage.

## Event dictionary

| Event | Meaning | Count as accepted lead? |
| --- | --- | --- |
| `page_view` | A page rendered; the event includes only the path | No |
| `quote_cta_click` | User chose an internal link to the quote page | No |
| `quote_start` | First interaction with a quote form | No |
| `quote_submit_success` | Primary inquiry store explicitly accepted the inquiry (HubSpot in the candidate); email notification receipt is separate | Yes |
| `quote_submit_failed` | Client validation or explicit provider rejection | No |
| `quote_submit_pending` | Timeout, network, 202, non-JSON or unknown response | No |
| `whatsapp_click` | User chose a WhatsApp contact link | No |
| `email_click` | User chose an email contact link | No |

Allowed parameters are limited to form/page identifiers, shipping method, allowlisted service needs, allowlisted inspection types, result category, link location and non-sensitive request references. Names, email addresses, phone numbers, cargo text, full URLs, query strings and free-form values must not be sent to analytics.

`quote_cta_click.link_location` is accepted only from this fixed list: `home_header_mobile`, `home_header_desktop`, `home_hero`, `customer_scenario_consolidation`, `customer_scenario_fba`, `customer_scenario_complex_cargo`, `ocean_hero`, `service_hero` and `service_footer`. Any missing or unrecognized value is recorded as `site`. Query-string values and visible link copy are never used as analytics parameters. The sea-freight page's same-page `#quote-form` link uses `ocean_hero`; arbitrary same-page anchors are not counted.

Direct visits or refreshes of `/thank-you/` do not emit `quote_submit_success`. Only the submit handler emits that event after explicit acceptance.

Submissions containing the controlled marker `[TEST-GDLOGI]` (or the retained
legacy test phrase) do not emit submit-result or generated-lead events. This
keeps acceptance tests out of lead and outcome counts. Page views and an
anonymous form-start interaction can occur before a visitor has entered the
complete marker; when analytics is enabled, run controlled tests in GTM preview
mode or exclude their documented test session from traffic reporting as well.
