import { defineNuxtPlugin } from 'nuxt/app';
import { createBootstrap, Components } from 'bootstrap-vue-next';
import type { Component, DefineComponent } from '@vue/runtime-core';


type ComponentT = Component | DefineComponent

export default defineNuxtPlugin((nuxtApp) => {
  // Definisce bootstrap-vue
  nuxtApp.vueApp.use(createBootstrap());

  for (const key in Components) {

    // Ottiene l'elemento associato alla chiave
    const element = (Components as Record<string, ComponentT>)[key];

    // Aggiunge l'elemento al programma
    nuxtApp.vueApp.component(
      key, // ex. BButton
      element
    )
  }
});