import { readFileSync, writeFileSync } from "node:fs"

const file = new URL("../lib/cjs/index.js", import.meta.url)
const source = readFileSync(file, "utf8")

if (!source.includes("module.exports = createStyle;")) {
  writeFileSync(
    file,
    `${source}
module.exports = createStyle;
module.exports.default = createStyle;
`,
    "utf8"
  )
}
