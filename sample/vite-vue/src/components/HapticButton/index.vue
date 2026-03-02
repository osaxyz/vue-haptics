<script setup lang="ts">
import { ref } from "vue"
import { useHaptic } from "vue-haptics"
import "./style.css"

const is_continuous = ref(false)
const duration = ref(5000)
const interval = ref(100)
const { triggerHaptic } = useHaptic()

const handleClick = () => {
    if (is_continuous.value) {
        const start_time = Date.now()

        const continuousVibration = () => {
            if (Date.now() - start_time < duration.value) {
                triggerHaptic()
                setTimeout(continuousVibration, interval.value)
            }
        }

        continuousVibration()
    } else {
        triggerHaptic()
    }
}
</script>

<template>
    <div class="haptic-btn-container">
        <button class="haptic-btn" @click="handleClick" type="button">
            Feel Haptic !!!
        </button>
        <label>
            <input
                type="checkbox"
                v-model="is_continuous"
            />
            Continuous Haptic
        </label>
        <label>
            Duration (ms):
            <input
                type="number"
                v-model.number="duration"
            />
        </label>
        <label>
            Interval (ms):
            <input
                type="number"
                v-model.number="interval"
            />
        </label>
    </div>
</template>
