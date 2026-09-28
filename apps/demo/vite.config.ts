import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import { qrcode } from "vite-plugin-qrcode"

export default defineConfig({
    plugins: [vue(), qrcode()],
})
