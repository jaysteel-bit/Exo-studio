#!/usr/bin/env node
// Copy brand/fonts and brand/logo into every project's assets/ (after a fresh
// clone: project font folders are not in git, see .gitignore).

import { cpSync, existsSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
let synced = 0
for (const entry of readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory() || !existsSync(join(ROOT, entry.name, "hyperframes.json"))) continue
  cpSync(join(ROOT, "brand", "fonts"), join(ROOT, entry.name, "assets", "fonts"), { recursive: true })
  cpSync(join(ROOT, "brand", "logo"), join(ROOT, entry.name, "assets", "brand"), { recursive: true, force: false })
  synced += 1
}
console.log(`Brand assets synced into ${synced} project(s).`)
