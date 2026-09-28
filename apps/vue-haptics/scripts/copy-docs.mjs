// Copy README and LICENSE from the repository root into the package before packing,
// since npm only includes them from the package directory. Relative links in the
// README are rewritten to absolute GitHub URLs so they resolve on npmjs.com.
import { copyFile, readFile, writeFile } from "node:fs/promises"

const root = new URL("../../../", import.meta.url)
const here = new URL("../", import.meta.url)
const blob = "https://github.com/osaxyz/vue-haptics/blob/main/"
const raw = "https://raw.githubusercontent.com/osaxyz/vue-haptics/main/"

const readme = await readFile(new URL("README.md", root), "utf8")
const rewritten = readme
    .replace(
        /(src|srcset)="(?!https?:|#)([^"]+)"/g,
        (_, attr, path) => `${attr}="${raw}${path}"`,
    )
    .replace(/\]\((?!https?:|#)([^)]+)\)/g, (_, path) => `](${blob}${path})`)

await writeFile(new URL("README.md", here), rewritten)
await copyFile(new URL("LICENSE", root), new URL("LICENSE", here))
