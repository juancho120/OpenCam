# OpenCam feature-first architecture

OpenCam will be organized around user-facing camera capabilities, not technical layers. Each feature owns its screens, state, domain rules, and adapters; shared code stays deliberately small. The product is local-first but supports remote access through an OpenCam relay backend and an OpenCam user account. Accounts exist for ownership, remote access, recovery, and device management; they do not authorize payments, advertising, telemetry, or developer tooling.

## Quick path

1. Add or discover a camera locally.
2. Configure its connection and keep the device in the local device registry.
3. Open live view or playback.
4. Use controls, recording, captures, and alarms through the device capability boundary.
5. Keep diagnostics and data collection local and explicit.

The first implementation phase is documentation-only. The architecture includes a future OpenCam account service, relay backend, and Google Drive integration, but no source code, deployment, payment provider, analytics SDK, or remote logging is part of this decision. Google OAuth may link the user's Drive; it is separate from the OpenCam account identity.

## Product boundary

### Included in the product core

| Capability | Boundary |
|---|---|
| Device discovery | Discover cameras through supported local Wi-Fi, LAN, QR, BLE, or AP flows as each adapter becomes available. |
| Device setup | Configure a camera connection and validate the result without creating an account. |
| Device registry | Store and manage the user's devices locally and associate remote ownership with the OpenCam account. |
| Account and sessions | Create the minimum OpenCam identity needed for device ownership, remote access, recovery, and session revocation. |
| Google Drive link | Link a user's own Drive separately and only for explicit media export. |
| Live view | Stream a camera and expose only controls the connected device supports. |
| Playback | Browse and play recordings from SD/local device storage; cloud playback remains an adapter decision, not a payment feature. |
| Local capture | Take screenshots and make manual recordings to local storage. |
| Camera controls | PTZ, zoom, panorama, audio, and talkback behind capability checks. |
| Alarms | Configure and display device alarms, schedules, detection areas, and event history when exposed by the device protocol. |
| Notifications | Device alarm notifications only when they can be implemented without tracking or third-party analytics. |
| Remote access | The phone reaches a camera through an OpenCam relay; the camera maintains an outbound authenticated connection to the relay. |
| Google Drive export | The user explicitly authorizes their own Google Drive and chooses what captures or recordings to upload. |
| Local privacy | Privacy mode and local permission handling are product behavior, not telemetry. |

### Explicitly excluded

- In-app purchases, subscriptions, billing, wallet, orders, refunds, and paid cloud plans.
- Advertising and ad attribution.
- Analytics, behavioral tracking, telemetry, user profiling, and automatic log upload.
- Developer panels, test modes, server assignment, simulation, and diagnostic extraction tools.
- Payments, subscriptions, or account-based monetization.
- Behavioral profiling, telemetry, analytics, or automatic log upload through the account service.
- Automatic uploads, background synchronization, or access to a user's Drive without an explicit Google authorization.
- Any payment, advertising, analytics, telemetry, developer, or diagnostic service.
- Backend features unrelated to remote camera relay or explicit Google Drive export.

### Deferred decisions

- Device sharing between users.
- Push delivery through a third-party provider.
- AI detection performed outside the device.
- Multi-user permissions.
- Long-term cloud storage operated by OpenCam; Google Drive is user-owned export, not OpenCam storage.
- Authentication provider and account recovery mechanism; the domain remains provider-neutral until a separate decision.

A deferred capability may not leak into the core feature APIs. It must arrive later as an explicit adapter or feature with its own product decision.

## Repository shape

```text
apps/
├── mobile/                      # Expo/React Native client
│   └── src/
│       ├── app/                 # Expo Router route composition only
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── devices/
│       │   ├── live/
│       │   ├── playback/
│       │   ├── alarms/
│       │   └── settings/
│       ├── features/            # user-facing vertical slices
│       ├── domain/               # stable client-side contracts
│       ├── infrastructure/      # local/device/platform adapters
│       └── shared/               # small cross-feature UI/utilities
└── relay/                       # OpenCam remote camera gateway
    ├── features/                # accounts, sessions, camera links, relay streams, Drive jobs
    ├── domain/                  # account/relay/session/media contracts
    ├── infrastructure/          # transport, broker, secrets, storage, Drive API
    └── shared/                  # protocol-neutral utilities

# Current repository starts as the mobile app; the relay may become a sibling workspace
# when the remote protocol and deployment boundary are ready.

mobile/src/
├── features/                    # user-facing vertical slices
│   ├── device-discovery/
│   ├── device-setup/
│   ├── device-registry/
│   ├── live-view/
│   ├── playback/
│   ├── recording/
│   ├── camera-controls/
│   ├── alarms/
│   └── local-media/
├── domain/                      # stable business contracts, no React or transport code
│   ├── device/
│   ├── media/
│   ├── alarm/
│   └── capability/
├── infrastructure/              # replaceable device/storage/platform adapters
│   ├── camera-protocol/
│   ├── local-storage/
│   ├── media-runtime/
│   ├── permissions/
│   └── notifications/
└── shared/                      # small, truly cross-feature UI/utilities
    ├── components/
    ├── hooks/
    ├── theme/
    └── validation/
```

`src/app` is not a business-logic folder. A route should compose a feature screen and navigation parameters; it should not know how a camera protocol, player, storage engine, or alarm parser works.

## Remote relay boundary

Remote access is an explicit backend feature, not a hidden network call inside the mobile app.

```text
Camera ── outbound secure connection ── OpenCam relay ── authenticated session ── Mobile app
Mobile app ── local connection when nearby ── Camera
Mobile app ── Google OAuth ── user's Google Drive
```

The account and relay services own only what is required to establish and protect ownership and camera sessions:

- Minimal OpenCam identity, account recovery, session listing, and revocation.
- Camera ownership, connection registration, and device revocation.
- Short-lived device/session credentials and encrypted secret material.
- Camera command routing, stream relay, and event delivery.
- Connection liveness, reconnect, backpressure, and bounded buffering.
- Explicit audit records for security events only; no behavioral analytics.

The relay must not become a general-purpose media warehouse. Recordings stay on the camera or the user's device unless the user explicitly starts a Google Drive upload. Google access tokens belong to the user's Drive integration, must be short-lived where possible, and must never be sent to the camera. Account data is limited to identity, ownership, authorization, and security state.

The mobile app uses the same domain ports for local and remote connections. Only the infrastructure adapter changes; feature screens should not know whether a session is local or relayed.

## Feature slice contract

Every feature follows the same internal shape only when the feature needs it:

```text
features/<feature-name>/
├── screens/          # screen-level UI used by routes
├── components/       # feature-specific UI
├── domain/           # feature rules and types, if not shared globally
├── state/            # feature state and commands
├── services/         # use cases; depend on domain ports
├── adapters/         # translation to infrastructure ports
└── index.ts          # the public surface of the feature
```

Rules:

1. Routes import from a feature's `index.ts`, never from its internal files.
2. A feature may depend on `domain`, `infrastructure` ports, and `shared`; it may not import another feature's internals.
3. Infrastructure implements ports; it does not decide product behavior.
4. Shared code cannot contain camera-specific business rules.
5. UI receives capabilities and state; it does not infer support from model names or platform checks.
6. A missing device capability is an explicit state (`unsupported` or `unavailable`), not a silent no-op.
7. No feature may add analytics, automatic logging, ad SDKs, payment SDKs, or account state outside the `account` feature and its identity boundary.

## Domain contracts

The stable domain should describe what OpenCam can do without committing to the original V380 implementation:

- `Device`: local identity, label, connection metadata, model metadata, and supported capabilities.
- `DeviceConnection`: discovery, connect, disconnect, reconnect, and connection state for local or relayed sessions.
- `Account`: minimal OpenCam identity and account lifecycle state.
- `RemoteSession`: relay session establishment, expiry, reconnect, and close state tied to an account and device.
- `DeviceOwnership`: account-to-device association, pairing, transfer, and revocation.
- `MediaSource`: live stream, SD recording, local recording, and user-selected Google Drive export source.
- `PlaybackSession`: source, time range, position, pause, seek, and error state.
- `Capture`: screenshot or manual recording metadata and local file reference.
- `CameraControl`: PTZ, zoom, panorama, audio, talkback, and privacy commands.
- `AlarmEvent`: event type, timestamp, source, media references, and detection metadata.
- `AlarmRule`: enabled state, schedule, area, and supported detection options.
- `Capability`: a typed declaration of what a connected device actually supports.

These are ports and data contracts, not implementations. A local protocol adapter can implement them first; a future protocol or cloud adapter can implement them without rewriting screens.

## State and data ownership

| State | Owner | Persistence |
|---|---|---|
| Navigation state | Expo Router | Route params only |
| Live connection/session | `live-view` + connection port | In memory |
| Account session | `account` | Secure device storage for refresh/session material; revocable server state |
| Registered devices | `device-registry` | Local storage; ownership and relay link metadata are encrypted and revocable |
| Remote session | `live-view`/`playback` + relay port | In memory; short-lived server state |
| Playback position | `playback` | In memory initially |
| Captures and recordings | `local-media` | Local filesystem/media library after explicit permission |
| Google Drive authorization | `drive-export` | Platform-secure token storage; explicit user revocation |
| Alarm history | `alarms` | Device source or local cache, never telemetry |
| Permissions | `infrastructure/permissions` | Platform-managed; feature reads status |
| OpenCam account profile | `account` | Minimal server identity and security state; no behavioral profile |

## Privacy and removal rules

The architecture must make excluded behavior difficult to add accidentally:

- Do not install payment, advertising, analytics, attribution, crash-reporting, or remote-log dependencies.
- Keep `Account`, `Session`, and `AuthToken` inside the account/identity boundary; they must not leak into camera domain rules.
- Collect only identity and security data required for ownership, remote access, recovery, and revocation.
- Keep device labels, event history, and captures local by default; account and relay metadata is limited to ownership and connectivity.
- Never send diagnostic payloads automatically. Any media upload must be an explicit user action to the user's own Google Drive.
- Store camera secrets and relay credentials encrypted; never log them or include them in analytics.
- Request only the minimum Google Drive OAuth scope needed for user-selected uploads.
- Keep network clients behind infrastructure ports so endpoint and transport choices are visible in review.
- Treat cleartext, credentials, device keys, relay sessions, OAuth tokens, and local network discovery as security decisions requiring a separate review.

## Implementation order

1. **Foundation:** validate the Expo/React Native versions, add Expo Router, create the mobile route shell, and establish domain/infrastructure/shared boundaries.
2. **Local device path:** define discovery and connection ports; implement one local discovery path end-to-end.
3. **Device setup and registry:** configure a device, validate connectivity, persist it locally, and support removal.
4. **Local live view:** add a media session boundary and one supported stream path.
5. **Local media:** screenshots, manual recording, local file listing, and playback.
6. **Account foundation:** define provider-neutral account, session, recovery, and device-ownership contracts with minimal data.
7. **Relay contract:** define camera-to-relay and mobile-to-relay session contracts, credential lifecycle, stream limits, reconnect behavior, and threat model before deployment.
8. **Remote live view:** implement one relayed command and stream path without changing feature screens.
9. **Camera controls:** add PTZ, audio, talkback, panorama, and zoom as independently capability-gated slices.
10. **Alarms:** event model, device alarm configuration, local event history, and explicit notification behavior.
11. **Google Drive export:** implement explicit OAuth, user-selected upload, progress, cancellation, and revocation; keep Drive identity separate from OpenCam identity.
12. **Hardening:** permissions, offline/error states, security, performance, accessibility, and platform checks.

Each step must be independently demonstrable and must not pull payments, telemetry, developer tooling, or diagnostics into the product. The account foundation is included in the initial plan but remains isolated from camera domain rules.

## Acceptance checklist

- [ ] A new feature can be implemented without editing unrelated features.
- [ ] Routes contain composition and navigation only.
- [ ] Device protocol code is behind infrastructure ports.
- [ ] Unsupported camera capabilities render an explicit state.
- [ ] Device and media data remain local by default unless the user starts a relay session or Drive export.
- [ ] Remote sessions use short-lived, revocable credentials and bounded relay resources.
- [ ] Google Drive access is explicit, user-owned, minimally scoped, and revocable.
- [ ] No payment, advertising, telemetry, analytics, developer, or diagnostic dependency is present.
- [ ] Account data is limited to identity, ownership, authorization, recovery, and security state.
- [ ] Device sharing and OpenCam-operated cloud storage remain isolated behind undecided adapters.
- [ ] Local camera features remain testable without remote access or Drive.
- [ ] Remote features require an authenticated OpenCam account session and can be tested through the relay without changing local feature contracts.

## Next step

Turn this architecture into the first implementation slice: validate the Expo SDK dependency set, add the Expo Router shell, and create the empty local feature boundaries. Define the provider-neutral account and ownership contracts before the relay protocol; Google Drive OAuth should be added only after local capture/export contracts exist.
