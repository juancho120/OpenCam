# OpenCam local device discovery

This feature document tracks the next implementation slice after the initial foundation and local device registry.
It is the source of truth for the local discovery boundary and is read through `## Log` before implementation.

## Specs

1. **S1 — User request:** "revisa el plan de trabajo y empieza a codear"
2. **S2 — Roadmap target:** Implement the next product slice, local device discovery, after the foundation and device registry.
3. **S3 — Boundary:** Add a replaceable discovery contract and keep protocol-specific behavior behind an infrastructure adapter.
4. **S4 — User flow:** Let the registry screen start discovery, show progress and errors, and add discovered devices to the local registry.
5. **S5 — Scope:** Use a simulated adapter for this slice; do not claim support for a real camera protocol, relay backend, authentication, Google Drive, payments, telemetry, advertising, developer tooling, or diagnostics.
6. **S6 — Verification:** Run lint and TypeScript validation before declaring the slice complete.

## Tasks

- T1 — Define the local discovery contract — linked S3 — route: `features/device-discovery` — commit: 0d8389b
- T2 — Implement the simulated discovery adapter — linked S3/S5 — route: `features/device-discovery` — commit: 0d8389b
- T3 — Connect discovery to the device registry screen — linked S4 — route: `app` and feature indexes — commit: 0d8389b
- T4 — Verify the slice — linked S6 — route: checks — commit: 0d8389b

## Log

- L1 — User request: "revisa el plan de trabajo y empieza a codear"
- L2 — Existing roadmap reviewed: local device discovery is the next product slice after the foundation and device registry.
- L3 — Implementation decision: establish the protocol-neutral discovery boundary and validate the user flow with simulated results before selecting or implementing a real camera protocol.
