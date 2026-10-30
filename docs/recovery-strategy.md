# Recovery Strategy

A reliable browser media client should treat each remote media type as an independent operation.

1. Mark the lifecycle stage before starting an operation.
2. Validate client, user, and track objects before calling the provider SDK.
3. Use a bounded timeout for subscription and playback operations.
4. Retry transient failures with a small bounded delay.
5. Stop retrying after the configured attempt limit.
6. Emit a failure event with sanitized context.
7. Give the user a recovery path instead of leaving the interface in a permanent loading state.

Retrying should not conceal authentication, permission, or permanent capability errors. Providers may expose error codes that should be classified before retrying in a production adapter.
