<script setup lang="ts">
import { onMounted, ref } from "vue"
import { isHapticsSupported } from "vue-haptics"
import { settings } from "./settings"

const is_supported = ref(false)
const count = ref(0)

onMounted(() => {
    is_supported.value = isHapticsSupported()
})
</script>

<template>
    <main>
        <h1>vue-haptics</h1>
        <p>
            This device
            <strong>{{ is_supported ? "supports" : "does not support" }}</strong>
            haptic feedback.
        </p>

        <label class="toggle">
            <input
                v-model="settings.enabled"
                type="checkbox"
            >
            Enable haptics (plugin option)
        </label>

        <section aria-labelledby="tap-heading">
            <h2 id="tap-heading">
                v-haptic
            </h2>
            <div class="buttons">
                <button
                    v-haptic
                    type="button"
                >
                    Tap
                </button>
                <button
                    v-haptic
                    type="button"
                    @click="count++"
                >
                    Tapped {{ count }} times
                </button>
                <button
                    v-haptic="false"
                    type="button"
                >
                    Disabled
                </button>
            </div>
        </section>
    </main>
</template>
