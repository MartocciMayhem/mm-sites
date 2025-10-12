import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

let port = process.env.MMSITES_PREVIEW_PORT || "4400";
let dir = process.env.MMSITES_PREVIEW_DIR || "";
let slug = process.env.MMSITES_PREVIEW_SLUG || "";

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--port" && args[i + 1]) {
    port = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--dir" && args[i + 1]) {
    dir = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--slug" && args[i + 1]) {
    slug = args[i + 1];
    i += 1;
    continue;
  }
  if (!dir) {
    dir = arg;
  }
}

const candidates = [];
if (dir) candidates.push(dir);
if (slug) {
  candidates.push(path.join("dist", slug));
  candidates.push(slug);
}
candidates.push("dist");
candidates.push(".");

let root = null;
for (const candidate of candidates) {
  const abs = path.resolve(process.cwd(), candidate);
  try {
    const stats = fs.statSync(abs);
    if (stats.isDirectory()) {
      root = abs;
      break;
    }
  } catch {
    // ignore
  }
}

if (!root) {
  console.error("[mm-sites] unable to resolve preview directory from inputs:", { dir, slug, candidates });
  process.exit(1);
}

console.log(`[mm-sites] serving ${root} on port ${port}`);

const serveCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const serveArgs = ["serve", "-l", String(port), root];

let fallbackStarted = false;

function startFallback() {
  if (fallbackStarted) return;
  fallbackStarted = true;
  const python = process.platform === "win32" ? "python" : "python3";
  const pythonArgs = ["-m", "http.server", String(port), "--directory", root];
  console.warn("[mm-sites] falling back to python http.server");
  const py = spawn(python, pythonArgs, { stdio: "inherit", shell: process.platform === "win32" });
  py.on("exit", (code) => process.exit(code ?? 0));
  py.on("error", (err) => {
    console.error("[mm-sites] fallback server failed:", err?.message || err);
    process.exit(1);
  });
}

const child = spawn(serveCmd, serveArgs, { stdio: "inherit" });

child.on("error", (err) => {
  console.warn("[mm-sites] serve failed:", err?.message || err);
  startFallback();
});

child.on("exit", (code) => {
  if (code === 0 || fallbackStarted) {
    process.exit(code ?? 0);
    return;
  }
  console.warn("[mm-sites] serve exited unexpectedly; attempting fallback");
  startFallback();
});
