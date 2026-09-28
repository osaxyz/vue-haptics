// Copy README and LICENSE from the repository root into the package before packing,
// since npm only includes them from the package directory. The README is adapted for
// npmjs.com: relative links become absolute GitHub URLs, and GitHub alerts, which npm
// shows as plain quotes with a literal "[!NOTE]", become quotes with a bold label.
import { copyFile, readFile, writeFile } from "node:fs/promises"

const root = new URL("../../../", import.meta.url)
const here = new URL("../", import.meta.url)
const blob = "https://github.com/osaxyz/vue-haptics/blob/main/"
const raw = "https://raw.githubusercontent.com/osaxyz/vue-haptics/main/"

const alert_labels = {
    en: {
        NOTE: "Note",
        TIP: "Tip",
        IMPORTANT: "Important",
        WARNING: "Warning",
        CAUTION: "Caution",
    },
    ja: {
        NOTE: "注記",
        TIP: "ヒント",
        IMPORTANT: "重要",
        WARNING: "警告",
        CAUTION: "注意",
    },
}

// The Japanese half of the README starts at its language anchor.
const convertAlerts = (markdown) => {
    let language = "en"
    return markdown
        .split("\n")
        .map((line) => {
            if (line.startsWith('<a id="ja">')) {
                language = "ja"
            }
            const match =
                /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/.exec(line)
            return match ? `> **${alert_labels[language][match[1]]}**\n>` : line
        })
        .join("\n")
}

const readme = await readFile(new URL("README.md", root), "utf8")
const rewritten = convertAlerts(readme)
    .replace(
        /(src|srcset)="(?!https?:|#)([^"]+)"/g,
        (_, attr, path) => `${attr}="${raw}${path}"`,
    )
    .replace(/\]\((?!https?:|#)([^)]+)\)/g, (_, path) => `](${blob}${path})`)

await writeFile(new URL("README.md", here), rewritten)
await copyFile(new URL("LICENSE", root), new URL("LICENSE", here))
