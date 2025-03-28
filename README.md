<div align="center">
  <h1>use-haptic 📳</h1>
  <a href="https://github.com/posaune0423/use-haptic/actions/workflows/ci.yml">
    <img alt="CI" src="https://github.com/posaune0423/use-haptic/actions/workflows/ci.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/use-haptic">
    <img src="https://img.shields.io/npm/v/use-haptic.svg" alt="npm package" />
  </a>
  <a href="https://npmjs.org/package/use-haptic">
    <img alt="downloads" src="https://img.shields.io/npm/d18m/use-haptic" />
  </a>
  <a href="https://npmjs.org/package/use-haptic">
    <img alt="types included" src="https://badgen.net/npm/types/use-haptic" />
  </a>
</div>

A convenient React hook that utilizes `input[switch]` introduced in
[Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/) to
trigger haptic feedback anytime, anywhere in your application.

Try [Demo](https://use-haptic.deno.dev/) here !!!!! 👈🏻

## Features

- Trigger haptic feedback at any time in your React application
- Simple API

## Install

```bash
npm install use-haptic
```

## Quick start

```
git clone https://github.com/posaune0423/use-haptic.git
cd sample
deno task dev
```

And you can visit the demo page by scanning the QR code displayed in the
terminal.

## Usage

```tsx
import { useHaptic } from "use-haptic";

function VibrationButton() {
  const { vibe } = useHaptic();
  return <button onClick={vibe}>Vibe</button>;
}
```

## License

[MIT](./LICENSE)


## Publish npm package by [dnt](https://github.com/denoland/dnt)

```bash
# run script
deno run -A scripts/build_npm.ts 0.1.0

# go to output directory and publish
cd npm
npm publish
```