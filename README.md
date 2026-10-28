# OpenCam

OpenCam is a mobile-first Expo/React Native application for discovering, managing, and eventually controlling cameras from one user-owned app.

The project follows a feature-first architecture. The mobile client is local-first: device data remains on the device by default, while future remote access will use an OpenCam relay. User-selected media export is planned through the user's own Google Drive account. Payments, advertising, telemetry, behavioral analytics, developer tooling, and automatic diagnostic uploads are outside the product scope.

## Current status

The repository contains the first foundation slice:

- Expo/React Native project normalized for TypeScript.
- Expo Router route shell configured under `src/app`.
- Feature-first boundaries established under `src/features`.
- Local `device-registry` feature implemented.
- Device persistence implemented with AsyncStorage.
- Empty state for a new installation.
- Simulated camera flow for validating the first user journey.
- Add, list, replace simulated data, and remove operations for registered devices.
- Initial architecture and product-boundary documentation under `docs/architecture`.

This is an early foundation. It is not yet a camera-control application and does not connect to real camera protocols.

## Completed tasks

### Foundation

- Created the Expo project configuration and app entry points.
- Added TypeScript configuration and typed feature code.
- Configured Expo Router as the navigation foundation.
- Added the initial mobile route at `src/app/index.tsx`.

### Device registry

- Defined the `Device` domain model and supported capabilities.
- Added the `DeviceRepository` port and `DeviceRegistry` application service.
- Added an AsyncStorage repository adapter.
- Added simulated device data for development and demos.
- Added a camera list, empty state, loading state, error state, and remove action.

### Architecture and scope

- Documented feature-first boundaries and dependency rules.
- Documented the intended local-first, relay-based remote architecture.
- Documented the future OpenCam account, device ownership, and Google Drive boundaries.
- Explicitly excluded payments, advertising, telemetry, behavioral analytics, developer tooling, and automatic diagnostics.

## Pending tasks

### Immediate next slice

- Add focused automated tests for the device registry service and AsyncStorage adapter.
- Validate the app on an Expo development environment and supported mobile platforms.
- Replace simulated data with local camera discovery behind a protocol adapter.
- Add device setup and connection validation flows.
- Improve accessibility, loading feedback, error recovery, and destructive-action confirmation.

### Product roadmap

1. Local device discovery.
2. Device setup and registry completion.
3. Local live view and playback boundaries.
4. Local captures and recordings.
5. Provider-neutral OpenCam account and device ownership contracts.
6. OpenCam relay contracts for secure remote access.
7. Capability-gated camera controls and alarms.
8. Explicit, user-owned Google Drive export.
9. Security, permissions, offline behavior, performance, and accessibility hardening.

Deferred decisions are tracked in [`docs/architecture/feature-first.md`](docs/architecture/feature-first.md).

## Repository structure

```text
src/
├── app/                         # Expo Router route composition
└── features/
    └── device-registry/
        ├── application/         # use cases and repository ports
        ├── domain/              # device contracts and types
        └── infrastructure/      # AsyncStorage adapter

docs/architecture/               # product and architecture decisions
odd/tasks/                       # Organic Driven Development task records
```

Routes compose features. Feature code owns its domain behavior. Infrastructure adapters implement replaceable ports and must not leak transport or storage concerns into the UI.

## Development

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm run start
```

Run the available checks:

```bash
npm run lint
npx tsc --noEmit
```

## Scope principles

- Local data and media remain local unless the user explicitly starts a remote session or export.
- Camera capabilities are explicit and may be reported as unsupported or unavailable.
- OpenCam accounts are for ownership, remote access, recovery, and revocation—not profiling or monetization.
- Google Drive is user-owned export storage, not an OpenCam cloud-storage plan.
- No payment, advertising, analytics, telemetry, developer, or diagnostic service is part of this foundation slice.

## License

See [`LICENSE`](LICENSE).
