import { type ObjectDirective, toValue } from "vue"
import { haptic } from "./core"
import type { HapticDirectiveValue, HapticsOptions } from "./types"

export type HapticDirective = ObjectDirective<HTMLElement, HapticDirectiveValue>

type Binding = {
    event: string
    value: HapticDirectiveValue
    listener: () => void
}

const DEFAULT_EVENT = "click"

/**
 * Build a `v-haptic` directive that falls back to the given defaults.
 * `createHaptics()` uses this to register a directive tied to its options.
 */
export const createHapticDirective = (
    options: HapticsOptions = {},
): HapticDirective => {
    const bindings = new WeakMap<HTMLElement, Binding>()

    const play = (value: HapticDirectiveValue): void => {
        if (value === false || toValue(options.disabled)) {
            return
        }
        haptic(
            value === true || value == null ? toValue(options.pattern) : value,
        )
    }

    return {
        mounted(el, { arg, value }) {
            const binding: Binding = {
                event: arg ?? DEFAULT_EVENT,
                value,
                listener: () => play(binding.value),
            }
            el.addEventListener(binding.event, binding.listener)
            bindings.set(el, binding)
        },
        updated(el, { arg, value }) {
            const binding = bindings.get(el)
            if (!binding) {
                return
            }
            binding.value = value

            const event = arg ?? DEFAULT_EVENT
            if (event !== binding.event) {
                el.removeEventListener(binding.event, binding.listener)
                el.addEventListener(event, binding.listener)
                binding.event = event
            }
        },
        beforeUnmount(el) {
            const binding = bindings.get(el)
            if (binding) {
                el.removeEventListener(binding.event, binding.listener)
                bindings.delete(el)
            }
        },
        getSSRProps: () => ({}),
    }
}

/**
 * Play haptic feedback when the element is clicked.
 *
 * @example
 * ```vue
 * <button v-haptic>Tap</button>
 * <button v-haptic="[10, 60, 10]">Double tap</button>
 * <button v-haptic="is_enabled">Toggle</button>
 * <button v-haptic:pointerdown>On press</button>
 * ```
 */
export const vHaptic: HapticDirective = createHapticDirective()
