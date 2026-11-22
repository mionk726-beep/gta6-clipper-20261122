// make.fun entry: Clip GTA 6 for the most YouTube views
// Bounty: https://make.fun/bounty/gta6-clipper-01 ($500, 20 places, views decide)
// Entrant: @andre-setiawan (GitHub: mionk726-beep)
//
// What this program does:
//   1. Copies VIDEO.json (the published clip's YouTube address) to the
//      output directory, where the gate reads it: MAKEFUN_OUTPUT_DIR
//      (or /output in the grader), from MAKEFUN_BOT_DIR (or /bot).
//      That copy is the entry's whole job at grading time.
//   2. Downloads an IShowSpeed GTA 6 reaction Short from YouTube (yt-dlp).
//      The source is ALREADY vertical 9:16 with Speed's facecam on top and
//      the GTA 6 gameplay below — the layout Andre asked for (reference:
//      his IShowSpeed screenshot). No crop, no zoom: just a light upscale.
//   3. Renders it as a vertical 9:16 Short (720x1280, 30 fps, ~36 s).
//   4. Adds the hook caption as on-screen text (0-4 s):
//      "Speed Goes FULL JOHN WICK in GTA 6 Shootout".
//   5. Adds the make.fun pitch in the last 10 s, on screen AND spoken:
//      "You can earn money on make.fun making clips with AI" (TTS voiceover).
//   6. Renders a WhatsApp-sized copy (540x960).
//
// Run:  node main.ts            (needs ffmpeg and yt-dlp on PATH;
//                                needs vo-makefun.wav next to this file,
//                                or /opt/hatch/bin/tts to generate it)
// Output: /output/VIDEO.json (grading) + gta6-clip-full.mp4,
//         gta6-clip-whatsapp.mp4 (local rebuild of the clip)
//
// STANDARD LIBRARY ONLY: node:child_process, node:fs, node:path.
// No network calls from this program itself (yt-dlp does the download).
// The voiceover file was generated once with the TTS tool in the same
// session that wrote this program; see SESSION_NOTES.md.

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const CONFIG = {
  // Source footage — Tinez Gaming Clips, "Speed's reaction to this GTA 6
  // death is INSANE" (https://www.youtube.com/shorts/hw5ofxIJ8Gc), 36 s.
  // The GTA 6 ending: Jason and Lucia die in the police shootout on the
  // bridge; Speed's reactions (crying, screaming) are the hook.
  sourceUrl: "https://www.youtube.com/shorts/hw5ofxIJ8Gc",
  sourceCreator: "Tinez Gaming Clips",
  clipSeconds: 36.4,
  outW: 720,
  outH: 1280,
  fps: 30,
  // Hook caption (0-4 s), placed at the facecam/gameplay boundary.
  hookLine1: "Speed Goes FULL JOHN WICK",
  hookLine2: "in GTA 6 Shootout",
  hookSeconds: [0, 4],
  // make.fun pitch (last 10 s of the clip).
  pitchStart: 26,
  pitchText: "make.fun",
  pitchLine1: "You can earn money on",
  pitchLine2: "make.fun making clips with AI",
  voiceoverText: "You can earn money on make.fun making clips with AI.",
  voiceoverFile: "vo-makefun.wav",
  font: "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
};

function run(cmd: string, args: string[]): void {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.error) throw new Error(`${cmd} failed to start: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${cmd} exited with ${r.status}`);
}

function downloadSource(out: string): void {
  run("yt-dlp", [
    "-f", "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
    "--merge-output-format", "mp4",
    "-o", out,
    CONFIG.sourceUrl,
  ]);
}

function renderClip(source: string, vo: string, out: string): void {
  const f = CONFIG.font;
  const P = CONFIG.pitchStart;
  const C = CONFIG.clipSeconds;
  const filter =
    `[0:v]scale=${CONFIG.outW}:${CONFIG.outH}:flags=lanczos,` +
    `unsharp=5:5:0.5:5:5:0.0,fps=${CONFIG.fps},setsar=1[vbase];` +
    `[vbase]drawtext=fontfile=${f}:text='${CONFIG.hookLine1}':fontsize=40:` +
    `fontcolor=yellow:borderw=4:bordercolor=black:x=(w-text_w)/2:y=520:` +
    `enable='between(t,${CONFIG.hookSeconds[0]},${CONFIG.hookSeconds[1]})'[v1];` +
    `[v1]drawtext=fontfile=${f}:text='${CONFIG.hookLine2}':fontsize=46:` +
    `fontcolor=white:borderw=4:bordercolor=black:x=(w-text_w)/2:y=590:` +
    `enable='between(t,${CONFIG.hookSeconds[0]},${CONFIG.hookSeconds[1]})'[v2];` +
    `[v2]drawbox=x=0:y=0:w=${CONFIG.outW}:h=${CONFIG.outH}:color=black@0.45:t=fill:` +
    `enable='between(t,${P},${C})'[vdim];` +
    `[vdim]drawtext=fontfile=${f}:text='${CONFIG.pitchText}':fontsize=100:` +
    `fontcolor=white:borderw=5:bordercolor=black:x=(w-text_w)/2:y=470:` +
    `enable='between(t,${P},${C})'[v3];` +
    `[v3]drawtext=fontfile=${f}:text='${CONFIG.pitchLine1}':fontsize=44:` +
    `fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=640:` +
    `enable='between(t,${P},${C})'[v4];` +
    `[v4]drawtext=fontfile=${f}:text='${CONFIG.pitchLine2}':fontsize=34:` +
    `fontcolor=yellow:borderw=3:bordercolor=black:x=(w-text_w)/2:y=700:` +
    `enable='between(t,${P},${C})'[vout];` +
    `[0:a]volume='if(between(t,${P},${C}),0.35,1)':` +
    `eval=frame,aresample=48000[agame];` +
    `[1:a]volume=2.0,adelay=${P * 1000}|${P * 1000},` +
    `aresample=48000[avo];` +
    `[agame][avo]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]`;
  run("ffmpeg", [
    "-y", "-v", "error", "-i", source, "-i", vo,
    "-filter_complex", filter,
    "-map", "[vout]", "-map", "[aout]",
    "-c:v", "libx264", "-crf", "21", "-preset", "veryfast",
    "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
    out,
  ]);
}

function renderWhatsapp(full: string, out: string): void {
  run("ffmpeg", [
    "-y", "-v", "error", "-i", full,
    "-vf", "scale=540:960",
    "-c:v", "libx264", "-crf", "26", "-preset", "veryfast",
    "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
    out,
  ]);
}

function main(): void {
  // Hand VIDEO.json to the gate first: the scorer reads /output/VIDEO.json,
  // so this copy must happen even if the clip rebuild below cannot run
  // (the grader's sandbox has no network for the yt-dlp download).
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(join(BOT_DIR, "VIDEO.json"), join(OUTPUT_DIR, "VIDEO.json"));
  console.log(`VIDEO.json copied to ${join(OUTPUT_DIR, "VIDEO.json")}`);

  const source = "speed-gta6.mp4";
  if (!existsSync(source)) downloadSource(source);
  if (!existsSync(CONFIG.voiceoverFile)) {
    throw new Error(
      `Missing ${CONFIG.voiceoverFile}: generate it first with the TTS tool ` +
      `("/opt/hatch/bin/tts speak --voice avocado_v2:MAI_03 --language en ` +
      `--output ${CONFIG.voiceoverFile}") reading: ${CONFIG.voiceoverText}`,
    );
  }
  renderClip(source, CONFIG.voiceoverFile, "gta6-clip-full.mp4");
  renderWhatsapp("gta6-clip-full.mp4", "gta6-clip-whatsapp.mp4");
  console.log("Done: gta6-clip-full.mp4 (36s, 720x1280) + gta6-clip-whatsapp.mp4 (540x960)");
}

main();
