// Length of the vibration on devices with the Vibration API, in milliseconds.
// iOS plays a single system tick whose length cannot be set, so this is kept
// short to feel the same.
export const VIBRATION_MS = 10

const isBrowser = (): boolean =>
    typeof window !== "undefined" && typeof document !== "undefined"

export const canVibrate = (): boolean =>
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function"

// Safari exposes `switch` on HTMLInputElement since 17.4, and since 18 plays a haptic
// when the user toggles a switch control.
const canUseSwitch = (): boolean =>
    typeof HTMLInputElement !== "undefined" &&
    "switch" in HTMLInputElement.prototype

/**
 * Whether haptics need a switch under the user's finger. Since iOS 26.5, a
 * switch toggled from script no longer plays a haptic; only a real tap on its
 * label does. This is the case on touch devices with switches but without the
 * Vibration API, which in practice means iOS and iPadOS.
 */
export const needsSwitchOverlay = (): boolean =>
    isBrowser() &&
    !canVibrate() &&
    canUseSwitch() &&
    navigator.maxTouchPoints > 0

/**
 * Whether `v-haptic` can play haptic feedback in the current environment.
 * Always false during SSR.
 */
export const isHapticsSupported = (): boolean =>
    isBrowser() && (canVibrate() || needsSwitchOverlay())
