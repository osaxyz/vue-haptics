import { vi } from "vitest"

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

// Recreate iOS: no Vibration API, switches supported, touch input.
export const stubIos = () => {
    stubVibrate(null)
    Object.defineProperty(HTMLInputElement.prototype, "switch", {
        configurable: true,
        value: false,
    })
    Object.defineProperty(navigator, "maxTouchPoints", {
        configurable: true,
        get: () => 5,
    })
}

export const unstubIos = () => {
    Reflect.deleteProperty(HTMLInputElement.prototype, "switch")
    Reflect.deleteProperty(navigator, "maxTouchPoints")
}

export const resetDom = () => {
    document.body.innerHTML = ""
}
