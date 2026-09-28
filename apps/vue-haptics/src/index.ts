/**
 * vue-haptics
 *
 * Haptic feedback for Vue 3. Uses the Vibration API where available and a
 * hidden `<input switch>` on iOS Safari 18+.
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

export { type UseHapticsReturn, useHaptics } from "./composable"
export { DEFAULT_PATTERN, haptic, isHapticsSupported } from "./core"
export {
    createHapticDirective,
    type HapticDirective,
    vHaptic,
} from "./directive"
export { createHaptics, HAPTICS_KEY } from "./plugin"
export type {
    HapticDirectiveValue,
    HapticPattern,
    HapticsOptions,
    HapticsPluginOptions,
} from "./types"
