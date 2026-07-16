#!/usr/bin/env node
/**
 * Blocks production builds while the dev server is running.
 * Building during `next dev` corrupts .next and causes blank/unstyled pages.
 */
import { execSync } from "node:child_process";

function isDevServerRunning() {
  try {
    const output = execSync("lsof -ti :3000 2>/dev/null", { encoding: "utf8" }).trim();
    return Boolean(output);
  } catch {
    return false;
  }
}

if (isDevServerRunning()) {
  console.error("\nBuild blocked: dev server is running on port 3000.\n");
  console.error("Stop the dev server first (Ctrl+C in that terminal), then run:");
  console.error("  npm run build\n");
  console.error(
    "Running build while dev is active corrupts .next and causes blank pages.\n"
  );
  process.exit(1);
}
