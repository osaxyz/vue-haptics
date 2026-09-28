import {
    getCurrentInstance,
    hasInjectionContext,
    inject,
    onMounted,
    type Ref,
    readonly,
    shallowRef,
    toValue,
} from "vue"
import { haptic, isHapticPattern, isHapticsSupported } from "./core"
import { HAPTICS_KEY } from "./plugin"
import type { HapticPattern, HapticsOptions } from "./types"

export type UseHapticsReturn = {
    /**
     * Play haptic feedback. Safe to bind directly as an event handler:
     * a DOM event passed as the argument is ignored.
     */
    trigger: (pattern?: HapticPattern | Event) => void
    /** Becomes true after mount when the device can produce haptics. */
    isSupported: Readonly<Ref<boolean>>
}

/**
 * Composable for haptic feedback. Falls back to the defaults given to
 * `createHaptics()` when the plugin is installed.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useHaptics } from "vue-haptics"
 *
 * const { trigger } = useHaptics({ pattern: 20 })
 * </script>
 *
 * <template>
 *   <button @click="trigger">Tap</button>
 * </template>
 * ```
 */
export const useHaptics = (options: HapticsOptions = {}): UseHapticsReturn => {
    const app_options = hasInjectionContext() ? inject(HAPTICS_KEY, null) : null
    const is_supported = shallowRef(false)

    // Read support after mount so SSR and hydration agree on `false`.
    if (getCurrentInstance()) {
        onMounted(() => {
            is_supported.value = isHapticsSupported()
        })
    } else {
        is_supported.value = isHapticsSupported()
    }

    const trigger = (pattern?: HapticPattern | Event): void => {
        if (toValue(options.disabled) ?? toValue(app_options?.disabled)) {
            return
        }
        haptic(
            isHapticPattern(pattern)
                ? pattern
                : (toValue(options.pattern) ?? toValue(app_options?.pattern)),
        )
    }

    return { trigger, isSupported: readonly(is_supported) }
}
