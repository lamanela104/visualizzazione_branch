import type { ConnectionOptions } from "mysql2";

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
    dbconfig: { // Oggetto  per permettere una connessione al database, dati raccolti da .env
      database: process.env.dbname,
      host: process.env.dbhost,
      user: process.env.dbuser,
      password: process.env.dbpassword
    } as ConnectionOptions,
    bitbucket: {
      user: process.env.bitbucket_user,
      repo: process.env.bitbucket_repo
    }
  }
})
