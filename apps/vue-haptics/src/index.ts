/**
 * vue-haptics
 *
 * Haptic feedback for Vue 3. A tap on an element with `v-haptic` plays one
 * haptic tick: with the Vibration API on Android, and through a transparent
 * `<input switch>` under the finger on iOS Safari.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { vHaptic } from "vue-haptics"
 * </script>
 *
 * <template>
 *   <button v-haptic>Tap</button>
 * </template>
 * ```
 */

export { isHapticsSupported } from "./core"
export {
    createHapticDirective,
    type HapticDirective,
    vHaptic,
} from "./directive"
export { createHaptics } from "./plugin"
export type {
    HapticDirectiveValue,
    HapticsOptions,
    HapticsPluginOptions,
} from "./types"
