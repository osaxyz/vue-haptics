import { vi } from "vitest"

export const SWITCH_SELECTOR = 'label[for="vue-haptics-switch"]'

export const getSwitchLabel = (): HTMLLabelElement | null =>
    document.querySelector(SWITCH_SELECTOR)

// Replace navigator.vibrate for one test. Pass null to make it unavailable.
export const stubVibrate = (
    impl: ((pattern: VibratePattern) => boolean) | null,
) => {
    const vibrate = impl ? vi.fn(impl) : undefined
    Object.defineProperty(navigator, "vibrate", {
        configurable: true,
        writable: true,
        value: vibrate,
    })
    return vibrate
}

// Remove the shared switch so each test starts from an empty body.
export const resetDom = () => {
    document.body.innerHTML = ""
}
