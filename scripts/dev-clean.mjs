#!/usr/bin/env node
/**
 * Stops any process on port 3000, removes .next reliably, starts next dev.
 */
import { execSync, spawn } from "node:child_process";
import { rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");

function stopDevServer() {
  try {
    execSync("lsof -ti :3000 | xargs kill 2>/dev/null", { stdio: "ignore", shell: true });
  } catch {
    // Nothing listening on 3000.
  }
}

function removeNextCache() {
  if (!existsSync(nextDir)) return;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      rmSync(nextDir, { recursive: true, force: true });
      return;
    } catch {
      if (attempt < 2) {
        execSync("sleep 0.5");
      }
    }
  }

  throw new Error("Could not remove .next. Close other terminals using the project and retry.");
}

stopDevServer();
removeNextCache();

const child = spawn("npx", ["next", "dev"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
