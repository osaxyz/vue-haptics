import { type ObjectDirective, toValue } from "vue"
import { canVibrate, needsSwitchOverlay, VIBRATION_MS } from "./core"
import type { HapticDirectiveValue, HapticsOptions } from "./types"

export type HapticDirective = ObjectDirective<HTMLElement, HapticDirectiveValue>

type Overlay = {
    label: HTMLLabelElement
    input: HTMLInputElement
    // The inline position to put back on unmount, when the overlay changed it.
    previous_position: string | null
}

type Binding = {
    value: HapticDirectiveValue
    listener: (() => void) | null
    overlay: Overlay | null
}

// A transparent label covering the element, holding a switch. The user's tap
// lands on the label, which forwards a trusted click to the switch, and iOS
// plays a haptic. A click from script would be untrusted and play nothing.
const createOverlay = (el: HTMLElement): Overlay => {
    const label = document.createElement("label")
    label.setAttribute("aria-hidden", "true")
    label.setAttribute("data-vue-haptics", "")
    Object.assign(label.style, {
        position: "absolute",
        inset: "0",
        touchAction: "manipulation",
    })
    label.style.setProperty("-webkit-tap-highlight-color", "transparent")

    // Keep the switch out from under the finger: WebKit treats a touchstart on
    // a switch as handled, which would cancel scrolling.
    const input = document.createElement("input")
    input.type = "checkbox"
    input.tabIndex = -1
    input.setAttribute("switch", "")
    Object.assign(input.style, {
        position: "absolute",
        width: "1px",
        height: "1px",
        margin: "0",
        visibility: "hidden",
    })
    // The label's own click already reaches the element's handlers; stop the
    // copy it forwards to the switch so they do not run twice.
    input.addEventListener("click", (event) => event.stopPropagation())
    label.append(input)

    let previous_position: string | null = null
    const position = getComputedStyle(el).position
    if (position === "static" || position === "") {
        previous_position = el.style.position
        el.style.position = "relative"
    }
    el.append(label)

    return { label, input, previous_position }
}

/**
 * Build a `v-haptic` directive with its own options.
 * `createHaptics()` uses this to register a directive tied to its options.
 */
export const createHapticDirective = (
    options: HapticsOptions = {},
): HapticDirective => {
    const bindings = new WeakMap<HTMLElement, Binding>()

    const isEnabled = (value: HapticDirectiveValue): boolean =>
        value !== false && !toValue(options.disabled)

    return {
        mounted(el, { value }) {
            const binding: Binding = { value, listener: null, overlay: null }

            if (needsSwitchOverlay()) {
                const overlay = createOverlay(el)
                // Decide at tap time, before the label forwards its click,
                // so that reactive `disabled` options are honored.
                overlay.label.addEventListener("click", () => {
                    overlay.input.disabled = !isEnabled(binding.value)
                })
                binding.overlay = overlay
            } else if (canVibrate()) {
                const listener = () => {
                    if (isEnabled(binding.value)) {
                        navigator.vibrate(VIBRATION_MS)
                    }
                }
                el.addEventListener("click", listener)
                binding.listener = listener
            }

            bindings.set(el, binding)
        },
        updated(el, { value }) {
            const binding = bindings.get(el)
            if (!binding) {
                return
            }
            binding.value = value

            // Vue replaces the children when an element's text changes,
            // which removes the overlay.
            if (binding.overlay && !el.contains(binding.overlay.label)) {
                el.append(binding.overlay.label)
            }
        },
        beforeUnmount(el) {
            const binding = bindings.get(el)
            if (!binding) {
                return
            }
            if (binding.listener) {
                el.removeEventListener("click", binding.listener)
            }
            if (binding.overlay) {
                binding.overlay.label.remove()
                if (binding.overlay.previous_position !== null) {
                    el.style.position = binding.overlay.previous_position
                }
            }
            bindings.delete(el)
        },
        getSSRProps: () => ({}),
    }
}

/**
 * Play one haptic tick when the element is tapped.
 *
 * With the Vibration API, a click vibrates for a short fixed time. On iOS,
 * which plays haptics only for a real tap on a switch since iOS 26.5, a
 * transparent label holding a switch is placed over the element. The element
 * gets `position: relative` if it is statically positioned.
 *
 * @example
 * ```vue
 * <button v-haptic>Tap</button>
 * <button v-haptic="is_enabled">Only when enabled</button>
 * ```
 */
export const vHaptic: HapticDirective = createHapticDirective()
