import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { defineComponent, h, nextTick, ref, withDirectives } from "vue"
import { createHaptics, type HapticDirectiveValue, vHaptic } from "../src"
import { resetDom, stubIos, stubVibrate, unstubIos } from "./helpers"

// happy-dom does not support :scope, so look at the direct children.
const overlayOf = (el: Element) =>
    ([...el.children].find((child) =>
        child.matches("label[data-vue-haptics]"),
    ) as HTMLLabelElement | undefined) ?? null

const switchOf = (el: Element) =>
    overlayOf(el)?.querySelector<HTMLInputElement>("input[switch]") ?? null

describe("v-haptic on iOS", () => {
    beforeEach(() => {
        resetDom()
        stubIos()
    })

    afterEach(() => {
        unstubIos()
    })

    const mountButton = (
        value: () => HapticDirectiveValue,
        on_click = () => {},
        text = () => "Tap",
    ) =>
        mount(
            defineComponent({
                setup: () => () =>
                    withDirectives(h("button", { onClick: on_click }, text()), [
                        [vHaptic, value()],
                    ]),
            }),
            { attachTo: document.body },
        )

    it("covers the element with a label holding a switch", () => {
        const wrapper = mountButton(() => undefined)
        const button = wrapper.find("button").element

        const label = overlayOf(button)
        expect(label).not.toBeNull()
        expect(label?.style.position).toBe("absolute")
        expect(label?.getAttribute("aria-hidden")).toBe("true")
        expect(switchOf(button)?.style.visibility).toBe("hidden")
        expect(button.style.position).toBe("relative")
    })

    it("toggles the switch through the label and calls the handler once", () => {
        const on_click = vi.fn()
        const wrapper = mountButton(() => undefined, on_click)
        const button = wrapper.find("button").element

        overlayOf(button)?.click()

        expect(switchOf(button)?.checked).toBe(true)
        expect(on_click).toHaveBeenCalledTimes(1)
    })

    it("disables the switch when bound to false", async () => {
        const enabled = ref<HapticDirectiveValue>(false)
        const wrapper = mountButton(() => enabled.value)
        const button = wrapper.find("button").element

        overlayOf(button)?.click()
        expect(switchOf(button)?.checked).toBe(false)

        enabled.value = true
        await nextTick()
        overlayOf(button)?.click()
        expect(switchOf(button)?.checked).toBe(true)
    })

    it("follows the plugin's reactive disabled option at tap time", () => {
        const disabled = ref(true)
        const wrapper = mount(
            { template: "<button v-haptic>Tap</button>" },
            {
                attachTo: document.body,
                global: {
                    plugins: [
                        createHaptics({ disabled: () => disabled.value }),
                    ],
                },
            },
        )
        const button = wrapper.find("button").element

        overlayOf(button)?.click()
        expect(switchOf(button)?.checked).toBe(false)

        disabled.value = false
        overlayOf(button)?.click()
        expect(switchOf(button)?.checked).toBe(true)
    })

    it("puts the overlay back when Vue replaces the text", async () => {
        const text = ref("Repeat")
        const wrapper = mountButton(
            () => undefined,
            () => {},
            () => text.value,
        )
        const button = wrapper.find("button").element

        text.value = "Stop"
        await nextTick()

        expect(button.textContent).toBe("Stop")
        expect(overlayOf(button)).not.toBeNull()
    })

    it("removes the overlay and restores the position on unmount", () => {
        const wrapper = mountButton(() => undefined)
        const button = wrapper.find("button").element

        wrapper.unmount()

        expect(overlayOf(button)).toBeNull()
        expect(button.style.position).toBe("")
    })

    it("keeps a position the element already has", () => {
        const wrapper = mount(
            defineComponent({
                setup: () => () =>
                    withDirectives(
                        h("button", { style: { position: "fixed" } }, "Tap"),
                        [[vHaptic, undefined]],
                    ),
            }),
            { attachTo: document.body },
        )

        expect(wrapper.find("button").element.style.position).toBe("fixed")
    })
})

describe("v-haptic with the Vibration API", () => {
    afterEach(() => {
        stubVibrate(null)
        unstubIos()
    })

    it("does not add an overlay even on touch devices with switches", () => {
        stubIos()
        stubVibrate(() => true)
        const wrapper = mount(
            defineComponent({
                setup: () => () =>
                    withDirectives(h("button", "Tap"), [[vHaptic, undefined]]),
            }),
        )

        expect(overlayOf(wrapper.find("button").element)).toBeNull()
    })
})
