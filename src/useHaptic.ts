import { onMounted, onUnmounted, ref } from "vue"
import type { UseHapticReturn } from "./types"
import { detectiOS } from "./utils"

const haptic_duration = 5

/**
 * Vue composable for triggering haptic feedback on mobile devices
 *
 * This composable creates hidden DOM elements to trigger haptic feedback using the `input[switch]`
 * element for iOS devices and falls back to the Vibration API for other supported devices.
 *
 * @param {number} duration - The duration of the vibration in milliseconds (default: 5ms)
 * @returns {Object} An object containing the `triggerHaptic` function to trigger haptic feedback
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useHaptic } from "vue-haptics";
 *
 * const { triggerHaptic } = useHaptic(200); // 200ms vibration
 * </script>
 *
 * <template>
 *   <button @click="triggerHaptic">Vibrate</button>
 * </template>
 * ```
 */
export const useHaptic = (
    duration: number = haptic_duration,
): UseHapticReturn => {
    const input_ref = ref<HTMLInputElement | null>(null)
    const label_ref = ref<HTMLLabelElement | null>(null)
    const is_ios = detectiOS()

    onMounted(() => {
        const input = document.createElement("input")
        input.type = "checkbox"
        input.id = "haptic-switch"
        input.setAttribute("switch", "")
        input.style.display = "none"
        document.body.appendChild(input)
        input_ref.value = input

        const label = document.createElement("label")
        label.htmlFor = "haptic-switch"
        label.style.display = "none"
        document.body.appendChild(label)
        label_ref.value = label
    })

    onUnmounted(() => {
        if (input_ref.value) {
            document.body.removeChild(input_ref.value)
        }
        if (label_ref.value) {
            document.body.removeChild(label_ref.value)
        }
    })

    const triggerHaptic = () => {
        if (!is_ios && navigator?.vibrate) {
            navigator.vibrate(duration)
        } else {
            label_ref.value?.click()
        }
    }

    return { triggerHaptic }
}

export default useHaptic
