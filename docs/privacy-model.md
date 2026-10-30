# Privacy Model

Media diagnostics should be minimal, purpose-limited, and provider-neutral.

Recommended fields include a timestamp, lifecycle event, media type, coarse device family, coarse browser family, and SDK version. Avoid exact device identifiers, account identifiers, booking identifiers, IP addresses, full user agents, email addresses, cookies, tokens, authorization headers, and raw URLs.

Error messages and stack traces should be bounded in length and reviewed before transmission. Redact vendor-specific request data and user-provided text when it is not needed for diagnosis.

## Session monitoring adapters

The session correlation helpers accept normalized schedule and event objects from an application's own adapter. They do not read server logs or contact a provider. Keep the adapter outside the public package and remove raw request data before calling the helpers.

Use opaque session identifiers only when correlation is necessary. Do not pass customer names, emails, IP addresses, cookies, tokens, full URLs, or complete user-agent strings to a telemetry destination.
