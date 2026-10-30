# Privacy Model

Media diagnostics should be minimal, purpose-limited, and provider-neutral.

Recommended fields include a timestamp, lifecycle event, media type, coarse device family, coarse browser family, and SDK version. Avoid exact device identifiers, account identifiers, booking identifiers, IP addresses, full user agents, email addresses, cookies, tokens, authorization headers, and raw URLs.

Error messages and stack traces should be bounded in length and reviewed before transmission. Redact vendor-specific request data and user-provided text when it is not needed for diagnosis.
