// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [ // css richiesto per bootstrap-vue
    'bootstrap/dist/css/bootstrap.css',
    'bootstrap-vue-next/dist/bootstrap-vue-next.css'
  ],
  plugins: [ // elementi aggiunti per bootstrap-vue
    './plugins/bootstrap-vue.ts'
  ],
  runtimeConfig: {
    JSON_DIR: process.env.JSON_DIR
  }
})
