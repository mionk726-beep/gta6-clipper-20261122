[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/mionk726-beep/gta6-clipper-20261122/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/mionk726-beep/gta6-clipper-20261122/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

# GTA 6 clipper — make.fun entry

Bounty: [Clip GTA 6 for the most YouTube views](https://make.fun/bounty/gta6-clipper-01)
($500, 20 places, ranked by YouTube views at the deadline — Mon 23 Nov 2026 08:00 WIB).
Entrant: @andre-setiawan (GitHub: mionk726-beep).

## The clip

36-second vertical Short (720x1280, 30 fps) in the IShowSpeed facecam
layout Andre asked for — facecam on top, gameplay below, caption in the
middle (no crop, no zoom; the source is already vertical 9:16):

- **Footage:** Tinez Gaming Clips — "Speed's reaction to this GTA 6 death
  is INSANE" (https://www.youtube.com/shorts/hw5ofxIJ8Gc), full 36 s.
  The GTA 6 ending: Jason and Lucia die in the police shootout on the
  bridge; Speed's reactions (crying, screaming) are the hook. Original
  audio (game + Speed's reactions) kept.
- **Hook (0–4 s):** caption "Speed Goes FULL JOHN WICK / in GTA 6 Shootout"
  at the facecam/gameplay boundary, like the reference screenshot.
- **make.fun pitch (26–36 s):** on screen ("make.fun" + "You can earn money
  on make.fun making clips with AI") AND spoken (English voiceover, same line).
- **Upload channel (decided by Andre):** "Stickman Animation Mindset"
  (mionk726@gmail.com, 22,570 subscribers) — chosen over The Laugh Loop
  (1 subscriber) because this bounty is ranked by views.
- **History:** the first version of this entry used Skywalk Empire's
  "My First Hour in GTA 6 Was PURE CHAOS" (Lucia robbery, 45 s). Andre
  said the centre-crop was too blurry ("Burik amat") and then too zoomed
  ("jangan terlalu zoom") — it was re-rendered in HQ and then full-frame,
  published once as https://www.youtube.com/shorts/VN5_HSqxvDw, and then
  DELETED at Andre's request before the Speed version replaced it.
  The Speed version was published 22 Nov ~10:18 WIB as
  https://www.youtube.com/shorts/fSQZ7df0B6Y ("Speed Goes FULL JOHN WICK
  in GTA 6 Shootout", public) after Andre saw it and said "Ok".

## Files

- `main.ts` — the program (Node 22+, stdlib only). Run `node main.ts`
  with ffmpeg + yt-dlp on PATH and `vo-makefun.wav` beside it; it downloads
  the Speed Short, renders `gta6-clip-full.mp4` and `gta6-clip-whatsapp.mp4`.
  Validated end-to-end in Node v24.22.1 (22 Nov ~09:57 WIB) — reproduces
  the 36.39 s clip exactly.
- `VIDEO.json` — YouTube URL of the published clip (filled in after upload).
- `SESSION_NOTES.md` — the steps this session took (for the transcript bundle).

## Video description (to use at upload)

```
Made by my AI agent for a $500 bounty on make.fun, where you can earn money making clips with AI: https://make.fun/bounty/gta6-clipper-01
Play code: makefun-toucan-cornet-tablet

Gameplay: Tinez Gaming Clips — "Speed's reaction to this GTA 6 death is INSANE" (https://www.youtube.com/shorts/hw5ofxIJ8Gc)
Game: Grand Theft Auto VI (Rockstar Games)
```

Suggested upload title: "Speed Goes FULL JOHN WICK in GTA 6 Shootout"

Note: the play code was obtained 22 Nov ~09:38 WIB from the signed-in
make.fun API route (GET /api/competitions/gta6-clipper-01/play-code as
@andre-setiawan) — it is NOT on any public page.
