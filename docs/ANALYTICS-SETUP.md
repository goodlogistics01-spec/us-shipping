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
| `quote_start` | First interaction with a quote form | No |
| `quote_submit_success` | Provider explicitly accepted the inquiry | Yes |
| `quote_submit_failed` | Client validation or explicit provider rejection | No |
| `quote_submit_pending` | Timeout, network, 202, non-JSON or unknown response | No |
| `whatsapp_click` | User chose a WhatsApp contact link | No |
| `email_click` | User chose an email contact link | No |

Allowed parameters are limited to form/page identifiers, shipping method, allowlisted service needs, allowlisted inspection types, result category, link location and non-sensitive request references. Names, email addresses, phone numbers, cargo text, full URLs, query strings and free-form values must not be sent to analytics.

Direct visits or refreshes of `/thank-you/` do not emit `quote_submit_success`. Only the submit handler emits that event after explicit acceptance.
