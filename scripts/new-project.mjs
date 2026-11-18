#!/usr/bin/env node
// Create an Exo HyperFrames project with the naming convention:
//   YYYY-MM-DD__<campaign>__<piece>[-<format>]
// e.g. node scripts/new-project.mjs exo-launch product-film
//      node scripts/new-project.mjs exo-academy exa-teaser --format 9x16 --date 2026-11-20
//
// The folder name is the project's id: HyperFrames writes it into meta.json and
// project.json, and the HyperFrames app and Flow OS → Launch Studio list it.
// Projects are created next to this repo's folders (the repo root is the
// project home Flow OS scans: ~/Desktop/exo-studio).

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const CLI = "hyperframes@0.8.204"
const REGISTRY = "https://raw.githubusercontent.com/jaysteel-bit/Exo-studio/main/registry"
const FORMATS = { "16x9": [1920, 1080], "9x16": [1080, 1920], "1x1": [1080, 1080], "4x5": [1080, 1350] }
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function fail(message) {
  console.error(`new-project: ${message}`)
  process.exit(1)
}

const args = process.argv.slice(2)
const flag = (name) => {
  const at = args.indexOf(`--${name}`)
  if (at === -1) return undefined
  const value = args[at + 1]
  args.splice(at, 2)
  return value
}
const format = flag("format") ?? "16x9"
const date = flag("date") ?? new Date().toISOString().slice(0, 10)
const [campaign, piece] = args

if (!campaign || !piece) fail("usage: new-project.mjs <campaign> <piece> [--format 16x9|9x16|1x1|4x5] [--date YYYY-MM-DD]")
if (!SLUG.test(campaign)) fail(`campaign "${campaign}" must be lowercase words joined by hyphens`)
if (!SLUG.test(piece)) fail(`piece "${piece}" must be lowercase words joined by hyphens`)
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(`date "${date}" must be YYYY-MM-DD`)
if (!FORMATS[format]) fail(`format "${format}" must be one of ${Object.keys(FORMATS).join(", ")}`)

const name = `${date}__${campaign}__${piece}${format === "16x9" ? "" : `-${format}`}`
const dir = join(ROOT, name)
if (existsSync(dir)) fail(`${name} already exists`)

const [width, height] = FORMATS[format]
const now = new Date().toISOString()
mkdirSync(join(dir, "compositions"), { recursive: true })
mkdirSync(join(dir, "assets", "fonts"), { recursive: true })
mkdirSync(join(dir, "assets", "brand"), { recursive: true })

const html = readFileSync(join(ROOT, "templates", "exo-film", "index.html"), "utf8")
  .replaceAll("{{WIDTH}}", String(width))
  .replaceAll("{{HEIGHT}}", String(height))
  .replaceAll("{{FORMAT}}", format.replace("x", ":"))
writeFileSync(join(dir, "index.html"), html)
cpSync(join(ROOT, "brand", "fonts"), join(dir, "assets", "fonts"), { recursive: true })
cpSync(join(ROOT, "brand", "logo"), join(dir, "assets", "brand"), { recursive: true })

const json = (file, value) => writeFileSync(join(dir, file), JSON.stringify(value, null, 2) + "\n")
json("hyperframes.json", {
  $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
  registry: REGISTRY,
  paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
  media: { autoProxy: true },
})
json("meta.json", { id: name, name, createdAt: now })
json("project.json", { name, createdAt: now, createdBy: "exo-studio/new-project" })
json("package.json", {
  name: name.replaceAll("__", "--"),
  private: true,
  type: "module",
  scripts: {
    dev: `npx --yes ${CLI} preview`,
    lint: `npx --yes ${CLI} lint`,
    render: `npx --yes ${CLI} render`,
  },
})

console.log(`Created ${name}`)
console.log(`  Open it in Flow OS → Launch Studio → Exo editor, or: cd "${name}" && npm run dev`)
console.log(`  Add Exo beats: npx --yes ${CLI} add exo-hook-hero-reveal --dir "${name}"`)
