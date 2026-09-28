# vue-haptics

<img src=".github/assets/icon-512w.png" alt="vue-haptics" width="150px"/>

> Haptic feedback for Vue 3: a composable, a `v-haptic` directive and a plugin

## Overview

vue-haptics plays haptic feedback on Android and iOS from anywhere in a Vue app.

- On browsers with the [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API) (Android Chrome and others), it calls `navigator.vibrate()`.
- On iOS Safari 18 and later, it toggles a hidden [`<input type="checkbox" switch>`](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/), which makes the system play a haptic tick.

On devices with neither, calls do nothing.

## Features

- `v-haptic` directive for templates
- `useHaptics()` composable
- `haptic()` function you can call from stores and utilities
- `createHaptics()` plugin for app-wide defaults and a global on/off switch
- One shared hidden element for the whole page, created on first use
- SSR safe, TypeScript native, ESM and CJS

## Installation

```bash
npm install vue-haptics
```

```bash
pnpm add vue-haptics
```

```bash
yarn add vue-haptics
```

```bash
bun add vue-haptics
```

## Usage

### Directive

```vue
<script setup lang="ts">
import { vHaptic } from "vue-haptics"
</script>

<template>
  <button v-haptic>Tap</button>
  <button v-haptic="40">Heavy</button>
  <button v-haptic="[10, 60, 10]">Double tap</button>
  <button v-haptic="is_enabled">Only when enabled</button>
  <button v-haptic:pointerdown>On press</button>
</template>
```

The value is a pattern, or a boolean. `false` turns the directive off. The argument sets the event to listen to, and defaults to `click`.

### Composable

```vue
<script setup lang="ts">
import { useHaptics } from "vue-haptics"

const { trigger, isSupported } = useHaptics({ pattern: 20 })

const save = async () => {
  await store.save()
  trigger([10, 60, 10])
}
</script>

<template>
  <button @click="trigger">Tap</button>
  <button @click="save">Save</button>
  <p v-if="!isSupported">Haptics are not available on this device.</p>
</template>
```

`trigger` can be bound directly as an event handler. The event it receives is ignored.

### Function

```ts
import { haptic } from "vue-haptics"

haptic()
haptic(30)
haptic([10, 60, 10])
```

### Plugin

The plugin registers `v-haptic` globally and sets the defaults used by the directive and `useHaptics()`.

```ts
import { createApp } from "vue"
import { createHaptics } from "vue-haptics"
import App from "./App.vue"

createApp(App)
  .use(
    createHaptics({
      pattern: 15,
      disabled: () => !settings.haptics,
    }),
  )
  .mount("#app")
```

## API

### `haptic(pattern?)`

Plays haptic feedback. `pattern` is a length in milliseconds, or an array of alternating on and off lengths in the same shape as `navigator.vibrate()`. The default is `DEFAULT_PATTERN` (10).

A new call replaces a pattern that is still playing. `haptic(0)` or `haptic([])` stops it.

### `isHapticsSupported()`

Returns whether the device can play haptics. Returns `false` during SSR.

### `useHaptics(options?)`

| Option | Type | Description |
| --- | --- | --- |
| `pattern` | `MaybeRefOrGetter<HapticPattern>` | Pattern used when `trigger` is called without one |
| `disabled` | `MaybeRefOrGetter<boolean>` | Suppresses haptics while true |

Returns `{ trigger, isSupported }`. `isSupported` is a readonly ref that becomes `true` after mount, so it matches between SSR and hydration.

Options not given fall back to the plugin options.

### `vHaptic`

| Usage | Behavior |
| --- | --- |
| `v-haptic` | Plays the default pattern on click |
| `v-haptic="pattern"` | Plays the given pattern |
| `v-haptic="false"` | Does nothing |
| `v-haptic:event` | Listens to `event` instead of `click` |

The exported `vHaptic` uses the library defaults. The one registered by the plugin uses the plugin options. `createHapticDirective(options)` builds a directive with your own defaults.

### `createHaptics(options?)`

Takes the same `pattern` and `disabled` options as `useHaptics()`, plus `directive`: the name to register the directive under (default `"haptic"`), or `false` to skip registration.

## Notes on iOS

- iOS cannot control how long a tick lasts. Each "on" segment of a pattern becomes one tick, so `[10, 60, 10]` plays two ticks 70ms apart.
- iOS plays haptics only in response to a user gesture. Call `haptic()` from an event handler such as `click` or `pointerdown`. Ticks that come later in a pattern are played on a timer, and iOS may drop them.
- Haptics can be turned off in the system settings, and the page cannot detect this.

## Migrating from v2

| v2 | v3 |
| --- | --- |
| `useHaptic(duration)` | `useHaptics({ pattern: duration })` |
| `triggerHaptic()` | `trigger()` |
| `<button @click="triggerHaptic">` | `<button v-haptic>` |

The default length changed from 5ms to 10ms. v3 needs Vue 3.3 or later.

## Development

```bash
npm install
npm test
npm run lint
npm run typecheck
npm run build
```

Releases are published from GitHub Actions with [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers), so every version on npm carries a [provenance](https://docs.npmjs.com/generating-provenance-statements) statement that links it to the commit and workflow run it was built from. To release, bump `version` in `package.json` and `VERSION`, merge to `main`, then run:

```bash
gh workflow run publish.yml --ref main
```

Run the demo app and scan the QR code in the terminal to open it on a phone:

```bash
cd sample/vite-vue
npm install
npm run dev
```

## Credits

vue-haptics started as a Vue port of [use-haptic](https://github.com/posaune0423/use-haptic) by Asuma Yamada, and v3 is a rewrite for Vue. The idea of using `<input switch>` for iOS haptics comes from that project.

## License

[MIT](./LICENSE)
