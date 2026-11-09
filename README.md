# Muse Study Companion v2

Floating Windows study timer with Jolly, built with Electron.

## Features
- Accurate wall-clock countdown (including when the renderer is delayed)
- Automatic focus/short-break/long-break cycles or manual countdown
- Custom focus, break, goal and cycle lengths
- Local completed-focus history, today/week totals, daily goal progress
- Configurable timer text color, character/window size (40–200%), sound, notifications and auto-start
- Start/pause/resume, reset, skip, hide and close controls
- Local-only data stored in browser localStorage; no account or telemetry
- Context isolation, renderer sandbox, navigation restrictions and a content security policy

## Run
Install Node.js, then:
```sh
npm install
npm start
```
Build a portable Windows executable with `npm run dist`. For distribution to others, sign the executable rather than instructing people to bypass SmartScreen.

## Behavior
Settings are saved locally. Saving settings restarts the current focus session. Reset discards current session time without recording it. Skip advances phases without recording a completed focus session. Only fully completed focus sessions are counted. Closing while a timer runs preserves its deadline; reopening resumes based on the actual clock. Long system sleep completes at most one phase to avoid falsely counting multiple sessions.

History is capped at 500 completed focus sessions. Clearing history requires confirmation. Settings and history are local to the application's Electron profile.

## Limitations
- Windows build and notification behavior still require hands-on Windows testing.
- Resize is bounded by minimum window dimensions and available display area.
- Notification permissions depend on operating system and Electron settings.
- No cross-device sync or export yet.
- `make_cutout.py` is an optional legacy asset-generation helper with environment-specific paths; the shipped PNG is already included.

## Verification
Run `npm run check` for JavaScript syntax checks. Manual acceptance tests: focus timer completion, break transition, pause/resume, reset/skip, sleep/wake, restart while running, goal/history persistence, notification permission, size/color persistence and portable build launch.
