/**
 * vue-haptic
 *
 * A Vue composable library that provides haptic feedback functionality for mobile web applications.
 * This library uses the `input[switch]` element for iOS devices and the Vibration API for other devices.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useHaptic } from "vue-haptic";
 *
 * const { triggerHaptic } = useHaptic();
 * </script>
 *
 * <template>
 *   <button @click="triggerHaptic">Haptic</button>
 * </template>
 * ```
 */

export * from "./useHaptic"
