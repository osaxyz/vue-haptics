import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { DEFAULT_PATTERN, haptic, isHapticsSupported } from "../src"
import { getSwitchLabel, resetDom, stubVibrate } from "./helpers"

describe("haptic with the Vibration API", () => {
    afterEach(() => {
        stubVibrate(null)
    })

    it("vibrates with the default pattern", () => {
        const vibrate = stubVibrate(() => true)

        haptic()

        expect(vibrate).toHaveBeenCalledWith(DEFAULT_PATTERN)
        expect(getSwitchLabel()).toBeNull()
    })

    it("passes an array pattern as a mutable copy", () => {
        const vibrate = stubVibrate(() => true)
        const pattern = Object.freeze([10, 50, 10])

        haptic(pattern)

        expect(vibrate).toHaveBeenCalledWith([10, 50, 10])
        expect(vibrate?.mock.calls[0][0]).not.toBe(pattern)
    })

    it("reports support", () => {
        stubVibrate(() => true)
        expect(isHapticsSupported()).toBe(true)
    })
})

describe("haptic with the switch fallback", () => {
    beforeEach(() => {
        stubVibrate(null)
        resetDom()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("toggles a hidden switch", () => {
        haptic()

        const label = getSwitchLabel()
        const input = document.getElementById(
            "vue-haptics-switch",
        ) as HTMLInputElement | null
        expect(label).not.toBeNull()
        expect(input?.hasAttribute("switch")).toBe(true)
        expect(input?.checked).toBe(true)
        expect(label?.parentElement?.getAttribute("aria-hidden")).toBe("true")
    })

    it("creates the switch only once", () => {
        haptic()
        haptic()
        haptic()

        expect(document.querySelectorAll("#vue-haptics-switch")).toHaveLength(1)
    })

    it("recreates the switch if it was removed from the DOM", () => {
        haptic()
        resetDom()
        haptic()

        expect(getSwitchLabel()).not.toBeNull()
    })

    it("does not let the synthetic click reach document listeners", () => {
        const on_click = vi.fn()
        document.addEventListener("click", on_click)

        haptic()

        document.removeEventListener("click", on_click)
        expect(on_click).not.toHaveBeenCalled()
    })

    it("plays one tick per on-segment of a pattern", () => {
        haptic()
        const label = getSwitchLabel() as HTMLLabelElement
        const click = vi.spyOn(label, "click")

        haptic([10, 50, 20, 0, 30])

        expect(click).toHaveBeenCalledTimes(1)
        vi.advanceTimersByTime(59)
        expect(click).toHaveBeenCalledTimes(1)
        vi.advanceTimersByTime(1)
        expect(click).toHaveBeenCalledTimes(2)
        vi.advanceTimersByTime(20)
        expect(click).toHaveBeenCalledTimes(3)
    })

    it("skips zero-length segments", () => {
        haptic()
        const label = getSwitchLabel() as HTMLLabelElement
        const click = vi.spyOn(label, "click")

        haptic([0, 40, 10])
        expect(click).not.toHaveBeenCalled()
        vi.advanceTimersByTime(40)
        expect(click).toHaveBeenCalledTimes(1)
    })

    it("cancels a pattern still playing when called again", () => {
        haptic()
        const label = getSwitchLabel() as HTMLLabelElement
        const click = vi.spyOn(label, "click")

        haptic([10, 100, 10])
        haptic(0)
        vi.runAllTimers()

        expect(click).toHaveBeenCalledTimes(1)
    })
})
