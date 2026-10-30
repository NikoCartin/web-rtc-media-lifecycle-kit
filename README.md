# Web RTC Media Lifecycle Kit

Reusable defensive patterns for reliable browser-based real-time audio and video sessions.

This project is an independent, provider-agnostic implementation of common reliability techniques for browser media applications. It is not a copy of any production application and contains no customer data, credentials, private infrastructure details, or production logs.

## Included

- Bounded remote-track subscription retries with timeouts.
- Explicit media lifecycle stage markers.
- Safe video-track orientation diagnostics using `getSettings()`.
- Portable error telemetry sanitization.
- A privacy-conscious media event schema.
- Node.js tests with no runtime dependency on a media provider.

## Quick start

```sh
npm test
```

The modules are designed to be adapted to a provider SDK. The recovery helper expects a small adapter exposing `client.subscribe(user, mediaType)`, so the core logic remains testable without a browser or vendor account.

## Design principles

1. Never assume a remote user or track object exists.
2. Bound retries and timeouts so a failed media operation cannot hang the UI indefinitely.
3. Treat audio and video subscription as separate outcomes.
4. Record lifecycle stages that identify where a session stops progressing.
5. Collect only the diagnostic fields required to troubleshoot media behavior.
6. Never send credentials, cookies, authorization headers, email addresses, IP addresses, or full request URLs in telemetry.

## Browser orientation diagnostics

`inspectVideoTrack()` reads safe media settings and returns a normalized diagnostic object. It does not rotate, mutate, stop, or replace the underlying track. Applications can decide how to render the result for their own UI.

## Provider adapters

The core package does not ship a provider SDK or provider credentials. Integrators should write a thin adapter for their selected SDK and keep provider-specific behavior outside the generic lifecycle modules.

## Security and privacy

See [SECURITY.md](SECURITY.md) and [docs/privacy-model.md](docs/privacy-model.md). Please do not submit production logs or personal data in issues or pull requests.

## License

MIT. See [LICENSE](LICENSE).

## Privacy-conscious session monitoring

The package also includes generic helpers for correlating active scheduled sessions with normalized browser events. They classify only coarse device and browser families and do not read logs, call external APIs, or send notifications. See [docs/session-monitoring.md](docs/session-monitoring.md).
