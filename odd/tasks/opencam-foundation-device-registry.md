# OpenCam foundation and local device registry

This feature document tracks the first implementation slice for OpenCam.
It is the source of truth for the implementation tasks below and is read through `## Log` before work begins.

## Specs

1. **S1 — User request:** "genera un plan de trabajo y empecemos"
2. **S2 — First slice:** Start with "Foundation + `device-registry` local con datos simulados."
3. **S3 — Foundation:** Normalize the Expo/React Native project, add TypeScript and Expo Router, and create the feature-first boundaries.
4. **S4 — Device registry:** Implement a local device registry with a `Device` model, local persistence, add/remove behavior, an empty state, and simulated data.
5. **S5 — Non-goals for this slice:** Do not integrate real camera protocols, the relay backend, OpenCam authentication, Google Drive, payments, telemetry, advertising, developer tooling, or diagnostics.
6. **S6 — Verification:** Run focused checks plus Expo lint and TypeScript validation before declaring the slice complete.

## Tasks

- T1 — Normalize the Expo foundation — linked S3 — route: mobile foundation — commit: pending
- T2 — Create feature-first boundaries — linked S3 — route: mobile foundation — commit: pending
- T3 — Implement local device registry — linked S4 — route: `features/device-registry` — commit: pending
- T4 — Add navigation and empty state — linked S4 — route: `app` and registry screen — commit: pending
- T5 — Verify the slice — linked S6 — route: checks — commit: pending

## Log

- L1 — User request: "genera un plan de trabajo y empecemos"
- L2 — Decision recorded before implementation: begin with foundation plus a local `device-registry` using simulated data; defer real camera protocol, relay, accounts, Google Drive, and other integrations.
- L3 — Expo SDK 58 documentation checked: Expo Router is supported for SDK 58 and AsyncStorage is installed with `npx expo install @react-native-async-storage/async-storage`.
