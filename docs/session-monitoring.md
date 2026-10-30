# Privacy-Conscious Session Monitoring

A monitoring adapter can combine two bounded inputs:

1. Confirmed schedule rows with a session identifier and start and end timestamps.
2. Recent normalized browser events with the same opaque session identifier, event type, timestamp, and user agent.

`correlateActiveSessions()` returns only active scheduled sessions that have recent events. It classifies coarse device and browser families and groups duplicate event types. It does not read files, call an API, send email, or decide whether a session is healthy.

The application adapter remains responsible for:

- Reading its own schedule source.
- Reading its own logs or telemetry store.
- Removing IP addresses, cookies, tokens, authorization headers, email addresses, raw URLs, and unnecessary user-agent details.
- Applying retention, alerting, and access-control policies.

A schedule match alone does not prove that a participant is connected. Treat page loads, connection events, lifecycle stages, and media errors as separate signals.
