# OpenCam feature-first architecture

This document is the tracked architecture task for the initial OpenCam foundation.
It defines the feature boundary before implementation; it does not authorize source changes or backend work.

## Specs

1. **S1 — Functional scope:** "nos quedaremos con las funcionalidades que queremos sirvan realmente"
2. **S2 — Remove commercial and surveillance behavior:** "eliminamos toda funcionalidad de pago y telemetria, no es la idea revisar a los usuarios"
3. **S3 — Exclude internal tooling:** "no usaremos funcionalidades desarrollador y diagnostico"
4. **S4 — Defer identity:** "cuentas y autentitacion tampoco (por ahora al menos no cuentas)"
5. **S5 — Architecture approach:** "en base a esta lista vamos a crear una infra para este proyecto que estara basada en la filosofia de feature first para mejor manejo de todo"
6. **S6 — First deliverable:** The selected scope is architecture documentation only; no source or backend implementation in this task.
7. **S7 — Remote architecture:** The user wants "un backend para poder comunicarte con la camara en cualquier lugar" and selected a "Relay propio" approach.
8. **S8 — User-owned storage:** The user wants "una conexion a google drive para que el usuario pueda subir sus cosas a una cuenta propia" and does not want to pay for storage outside the user's Google allocation.
9. **S9 — Initial account decision:** The user said "implementemos cuentas de usuario en nuestro proyecto, osea contemplemos esto para el plan inicial".

## Tasks

- T1 — Define included and excluded capabilities — docs only — commit: d4ffa0c
- T2 — Document feature-first boundaries and dependency rules — docs only — commit: d4ffa0c
- T3 — Document implementation order and acceptance gates — docs only — commit: d4ffa0c
- T4 — Add relay and Google Drive boundaries — linked S7-S8 — docs only — commit: d4ffa0c
- T5 — Add OpenCam account and ownership boundaries — linked S9 — docs only — commit: d4ffa0c

## Log

- L1 — User request: "nos quedaremos con las funcionalidades que queremos sirvan realmente, eliminamos toda funcionalidad de pago y telemetria, no es la idea revisar a los usuarios, no usaremos funcionalidades desarrollador y diagnostico, cuentas y autentitacion tampoco (por ahora al menos no cuentas)\n\nen base a esta lista vamos a crear una infra para este proyecto que estara basada en la filosofia de feature first para mejor manejo de todo"
- L2 — User selected: "Solo arquitectura" — define features, boundaries, and contracts without modifying source code.
- L3 — User clarification: "mi idea es un app en telefono que te detecte la camara y poder manejarla, un backend para poder comunicarte con la camara en cualquier lugar, y una conexion a google drive para que el usuario pueda subir sus cosas a una cuenta propia sin pagar almacenamiento salvo sea el de google por lugares externos"
- L4 — User selected: "Relay propio" — build the remote path around an OpenCam relay instead of depending on the manufacturer's remote service.
- L5 — User clarification: "implementemos cuentas de usuario en nuestro proyecto, osea contemplemos esto para el plan inicial" — OpenCam accounts are now part of the initial architecture plan for identity, ownership, remote access, recovery, and revocation.
