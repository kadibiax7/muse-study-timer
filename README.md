# Muse Study Timer

A floating study countdown timer for Windows. Muse (Jolly) floats on top of
every window with the countdown right on his chest. He bobs along, looks left
and right, waves at you now and then, and jumps when you click him.

## Run it

**Easiest:** download the Windows build (`study-timer-windows.zip`) from
Google Drive, unzip it, and double-click `Study Timer.exe`. No install needed.

**From source:**

```sh
npm install
npx electron .
```

## What it does

- Countdown timer with 15 / 25 / 45 / 60 minute presets, Start/Pause and Reset
- Shows today's date
- Chimes when time is up
- Always on top, resizable — drag Jolly anywhere on screen
- Jolly idles, looks around, waves, and jumps (click him and he jumps)

## Files

- `main.js` — the app window (transparent, frameless, always on top)
- `index.html` — Jolly, the countdown, and the animations
- `jolly.png` — Muse's avatar cut out of its white background
- `make_cutout.py` — regenerates `jolly.png` from the avatar image
- `package.json` — app metadata

## Notes

- Windows may show a SmartScreen warning because the app is unsigned.
  Click "More info", then "Run anyway".
- `jolly.png` is Muse's avatar (Jolly), used with permission for this
  personal project.
