import { afterEach, describe, expect, it } from "vitest"
import { isHapticsSupported } from "../src"
import { stubIos, stubVibrate, unstubIos } from "./helpers"

describe("isHapticsSupported", () => {
    afterEach(() => {
        stubVibrate(null)
        unstubIos()
    })

    it("is true with the Vibration API", () => {
        stubVibrate(() => true)
        expect(isHapticsSupported()).toBe(true)
    })

    it("is true on iOS", () => {
        stubIos()
        expect(isHapticsSupported()).toBe(true)
    })

    it("is false without the Vibration API or touch switches", () => {
        stubVibrate(null)
        expect(isHapticsSupported()).toBe(false)
    })
})
