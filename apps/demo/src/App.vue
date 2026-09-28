<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue"
import { type HapticPattern, useHaptics } from "vue-haptics"
import { settings } from "./settings"

const presets: { label: string; pattern: HapticPattern }[] = [
    { label: "Light", pattern: 5 },
    { label: "Default", pattern: 10 },
    { label: "Heavy", pattern: 40 },
    { label: "Double tap", pattern: [10, 60, 10] },
    { label: "Triple tap", pattern: [10, 60, 10, 60, 10] },
]

const { trigger, isSupported } = useHaptics()

const duration = ref(3000)
const interval = ref(100)
const is_repeating = ref(false)
let repeat_timer: ReturnType<typeof setInterval> | undefined

const stopRepeat = () => {
    clearInterval(repeat_timer)
    is_repeating.value = false
}

const startRepeat = () => {
    stopRepeat()
    const started_at = Date.now()
    is_repeating.value = true
    trigger()
    repeat_timer = setInterval(() => {
        if (Date.now() - started_at >= duration.value) {
            stopRepeat()
            return
        }
        trigger()
    }, interval.value)
}

onBeforeUnmount(stopRepeat)
</script>

<template>
    <main>
        <h1>vue-haptics</h1>
        <p>
            This device
            <strong>{{ isSupported ? "supports" : "does not support" }}</strong>
            haptic feedback.
        </p>

        <label class="toggle">
            <input
                v-model="settings.enabled"
                type="checkbox"
            >
            Enable haptics (plugin option)
        </label>

        <section aria-labelledby="directive-heading">
            <h2 id="directive-heading">
                v-haptic
            </h2>
            <div class="buttons">
                <button
                    v-for="preset in presets"
                    :key="preset.label"
                    v-haptic="preset.pattern"
                    type="button"
                >
                    {{ preset.label }}
                </button>
                <button
                    v-haptic:pointerdown
                    type="button"
                >
                    On pointerdown
                </button>
            </div>
        </section>

        <section aria-labelledby="composable-heading">
            <h2 id="composable-heading">
                useHaptics
            </h2>
            <div class="fields">
                <label>
                    Duration (ms)
                    <input
                        v-model.number="duration"
                        type="number"
                        min="0"
                    >
                </label>
                <label>
                    Interval (ms)
                    <input
                        v-model.number="interval"
                        type="number"
                        min="16"
                    >
                </label>
            </div>
            <button
                type="button"
                @click="is_repeating ? stopRepeat() : startRepeat()"
            >
                {{ is_repeating ? "Stop" : "Repeat" }}
            </button>
        </section>
    </main>
</template>
