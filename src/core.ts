import type { HapticPattern } from "./types"

export const DEFAULT_PATTERN: HapticPattern = 10

const switch_id = "vue-haptics-switch"

let switch_label: HTMLLabelElement | null = null
let pending_timers: ReturnType<typeof setTimeout>[] = []

const isBrowser = (): boolean =>
    typeof window !== "undefined" && typeof document !== "undefined"

const canVibrate = (): boolean =>
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function"

// Safari 18+ exposes `switch` on HTMLInputElement and plays a haptic
// whenever a switch control is toggled.
const canUseSwitch = (): boolean =>
    typeof HTMLInputElement !== "undefined" &&
    "switch" in HTMLInputElement.prototype

/**
 * Whether the current environment can produce haptic feedback.
 * Always false during SSR.
 */
export const isHapticsSupported = (): boolean =>
    isBrowser() && (canVibrate() || canUseSwitch())

export const isHapticPattern = (value: unknown): value is HapticPattern =>
    typeof value === "number" ||
    (Array.isArray(value) && value.every((v) => typeof v === "number"))

// One hidden switch is shared by the whole page. It is created on first use
// so that nothing is added to the DOM until haptics are actually requested.
const ensureSwitch = (): HTMLLabelElement => {
    if (switch_label?.isConnected) {
        return switch_label
    }

    const container = document.createElement("div")
    container.setAttribute("aria-hidden", "true")
    container.style.display = "none"
    // The synthetic click must not reach the app's own click handlers.
    container.addEventListener("click", (event) => event.stopPropagation())

    const input = document.createElement("input")
    input.type = "checkbox"
    input.id = switch_id
    input.tabIndex = -1
    input.setAttribute("switch", "")

    const label = document.createElement("label")
    label.htmlFor = switch_id

    container.append(input, label)
    document.body.append(container)
    switch_label = label

    return label
}

// Start offsets of each "on" segment in a vibration pattern.
const pulseOffsets = (pattern: HapticPattern): number[] => {
    if (typeof pattern === "number") {
        return pattern > 0 ? [0] : []
    }

    const offsets: number[] = []
    let elapsed = 0
    pattern.forEach((length, index) => {
        if (index % 2 === 0 && length > 0) {
            offsets.push(elapsed)
        }
        elapsed += Math.max(0, length)
    })
    return offsets
}

const cancelPending = (): void => {
    for (const timer of pending_timers) {
        clearTimeout(timer)
    }
    pending_timers = []
}

/**
 * Play haptic feedback.
 *
 * Uses the Vibration API where available and falls back to toggling a hidden
 * `<input switch>` on iOS Safari. On iOS each "on" segment of the pattern
 * becomes a single tick, since the length of a tick cannot be controlled.
 *
 * As with `navigator.vibrate()`, a new call replaces any pattern still
 * playing, and `0` or `[]` stops it.
 *
 * @example
 * haptic()             // short tick
 * haptic(30)           // 30ms
 * haptic([10, 60, 10]) // double tap
 */
export const haptic = (pattern: HapticPattern = DEFAULT_PATTERN): void => {
    if (!isBrowser()) {
        return
    }

    cancelPending()

    if (canVibrate()) {
        navigator.vibrate(typeof pattern === "number" ? pattern : [...pattern])
        return
    }

    for (const offset of pulseOffsets(pattern)) {
        if (offset === 0) {
            ensureSwitch().click()
        } else {
            pending_timers.push(
                setTimeout(() => ensureSwitch().click(), offset),
            )
        }
    }
}
