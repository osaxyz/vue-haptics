import { createApp } from "vue"
import { createHaptics } from "vue-haptics"
import App from "./App.vue"
import { settings } from "./settings"
import "./style.css"

createApp(App)
    .use(createHaptics({ disabled: () => !settings.enabled }))
    .mount("#app")
