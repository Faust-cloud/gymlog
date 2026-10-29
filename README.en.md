<p align="center">
  <img src="docs/banner.svg" alt="gymlog: a workout logger in a single HTML file" width="100%">
</p>

<p align="center">
  <b>A gym log for people who don't count reps and don't follow a plan.</b><br>
  One HTML file. Add it to your iPhone home screen and it works like an app — offline, no account, data never leaves the phone.
</p>

<p align="center">
  <a href="https://faust-cloud.github.io/gymlog/"><b>Open the app</b></a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="README.md">中文</a>
</p>

---

I tried several workout apps and quit all of them. My training doesn't fit their model: no program, I take whatever machine is free, I scroll my phone between sets and forget to log, and I forget to tap "finish" — once I came back to a 15-hour workout.

So I wrote one around those habits.

> The interface is Chinese-only for now (weights in kg).

## What it does

- **One tap per set.** A new set copies the previous weight and reps and shows what you did last time. Tap ✓ and the rest timer starts.
- **Don't feel like counting?** Mark a set as "about the same as last time". Estimated sets never count as personal records.
- **Forgot to finish?** After 10 idle minutes the workout closes itself, ending at your last completed set. You can reopen it the same day.
- **No plan?** The exercise picker puts what you haven't trained longest at the top. Machine taken? Swap to another exercise for the same muscle in one tap.
- **Rest alarm that works on a locked phone,** with the silent switch on, while you're in another app.
- Warm-up sets, PR detection, per-exercise charts (max weight, estimated 1RM, volume), weekly stats, editable history, JSON backup.

## How it works

The whole app is a ~1,200-line `index.html` in vanilla JavaScript: no framework, no build, no backend. A small `sw.js` handles offline caching.

- **A lock-screen alarm without push notifications.** Web pages can't run timers in the background. So when you finish a set, the app synthesizes a WAV on the fly — silence as long as your rest period, then a chime — and plays it as media. iOS keeps media playing when locked and ignores the silent switch, so the chime lands on time. The cost: it pauses your music, so there's a mode that doesn't.
- **The timer stores an end timestamp,** never a running count, so suspension or a page reload can't make it drift.
- **Auto-finish without background work.** On open, it checks how long you've been idle and backdates the end time to your last set.
- **Versioned storage.** Data in `localStorage` carries a schema version and migrates step by step; failed writes roll back.

## Run locally

```bash
git clone https://github.com/Faust-cloud/gymlog.git && cd gymlog
python3 -m http.server 8000   # open http://localhost:8000
```

## License

[MIT](LICENSE)
