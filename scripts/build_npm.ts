// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "use-haptic",
    version: Deno.args[0],
    description: "useHaptic is a React hook that allows you to use haptic feedback on your website.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/posaune0423/use-haptic.git",
    },
    bugs: {
      url: "https://github.com/posaune0423/use-haptic/issues",
    },
  },
  typeCheck: false,
  test: false,
  declaration: false,
  scriptModule: false,
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});