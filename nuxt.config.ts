// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: [ // css richiesto per bootstrap-vue
    'bootstrap/dist/css/bootstrap.css',
    'bootstrap-vue-next/dist/bootstrap-vue-next.css'
  ],
  plugins: [ // elementi aggiunti per bootstrap-vue
    './plugins/bootstrap-vue.ts'
  ],
  runtimeConfig: {
    app: {
      dbconfig: { // Oggetto  per permettere una connessione al database, dati raccolti da .env
        database: process.env.dbname,
        host: process.env.dbhost,
        user: process.env.dbuser,
        password: process.env.dbpassword
        
      }
    }
  },
})
