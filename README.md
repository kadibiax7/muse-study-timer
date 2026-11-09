# Muse Study Companion v2

## Download for Windows

**[Download the latest Windows installer (GitHub Releases)](https://github.com/kadibiax7/muse-study-timer/releases/latest)**

When a release has been published, download the file named `Muse-Study-Timer-Setup-<version>.exe` under **Assets**. Run it and follow the installer prompts. The installer can create Desktop and Start Menu shortcuts. **Until the first release is published, this page will not contain a downloadable installer.**

For test builds before release, open the repository's **Actions → Windows installer → latest successful run → Artifacts**, and download `Muse-Study-Timer-Windows` (GitHub sign-in may be required). Extract the ZIP and run the setup EXE.

The installer is currently unsigned. Windows may show a SmartScreen warning. Verify that you downloaded it from this repository; code signing is recommended before broad public distribution.


Floating Windows study timer with Jolly, built with Electron.

## Minimal floating mode

By default, only Jolly and the clickable countdown are visible. The date and large control panel are hidden. Hover over Jolly to reveal the small gear, click the gear or right-click Jolly to open the controls, then click **Done** or press **Escape** to hide them. The window expands only while controls are open. The countdown remains directly editable.

## Everyday controls

- **Click the large countdown on Jolly** to edit hours and minutes directly. Saving pauses and sets a manual focus countdown.
- **Drag Jolly** to reposition the floating window.
- **Size slider or +/- buttons** on the main panel resize the character and timer without code.
- **Color picker** on the main panel changes countdown text color immediately.
- **Start / Pause**, **Restart** (starts the current phase over), and **Reset** (stops and restores its full duration) are always visible.
- Open **Settings** only for optional advanced break cycles, goals and notifications.

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
Build a Windows setup executable with `npm run dist` (output in `dist/`). For distribution to others, sign the executable rather than instructing people to bypass SmartScreen.

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
