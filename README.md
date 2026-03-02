# vue-haptic
A convenient Vue composable to trigger haptic feedback anywhere in your application

## Overview

This package utilizes the `input[switch]` element introduced in
[Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/) to
trigger haptic feedback anytime, anywhere in your Vue application.

## Features

- Trigger haptic feedback at any time in your Vue application
- Support iOS, Android
- Simple, intuitive API
- Native TypeScript support
- ESM / CJS compatible

## Installation

```bash
npm install vue-haptic
```

```bash
yarn add vue-haptic
```

```bash
pnpm add vue-haptic
```

```bash
bun add vue-haptic
```

## Usage

```vue
<script setup lang="ts">
import { useHaptic } from "vue-haptic";

const { triggerHaptic } = useHaptic();
</script>

<template>
  <button @click="triggerHaptic">Feel Haptic</button>
</template>
```

## Quick Start

Clone the repository and run the sample app:

```bash
git clone https://github.com/artouc/vue-haptic.git
cd sample/vite-vue
npm install
npm run dev
```

You can visit the demo page by scanning the QR code displayed in the terminal.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### Publishing to npm

```bash
npm run build
npm publish
```

## License

[MIT](./LICENSE)