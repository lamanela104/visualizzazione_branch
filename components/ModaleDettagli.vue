<template>
  <b-button size="sm" class="mr-1" variant="info" @click="apriModale">
    Mostra Dettagli
  </b-button>
  <b-modal v-model="modaleAperto" hide-footer title="Modale dettagli">
    <!-- Dettagli sull'ultimo commit -->
    <b-card title="Informazioni dell'ultimo commit" v-if="model.commit">
      <b-list-group>
        <b-list-group-item
          button
          v-for="(value, key) in model.commit"
          :key="key"
          @click="copia(value, key)"
        >
          {{ key }}: {{ value }}
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <!-- Altri dettagli specificati dalla funzione altreInformazioni() -->
    <b-card title="Altre informazioni">
      <b-list-group>
        <b-list-group-item
          button
          v-for="(value, key) in altreInformazioni()"
          :key="key"
          @click="copia(value, key)"
        >
          {{ key }}: {{ value }}
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-modal>
</template>

<script setup lang="ts">
import type { EnvironmentT } from "typings";

const model: { value: EnvironmentT } = defineModel();
const modaleAperto = ref<boolean>(false);

function apriModale() {
  modaleAperto.value = true;
}
function nascondiModale() {
  modaleAperto.value = false;
}
function altreInformazioni() {
  let infos: Record<string, string> = {};
  infos["Percorso"] = model.value.path;
  if (model.value.deploy_path) infos["Percorso di Deploy"] = model.value.deploy_path;
  return infos;
}
/**
 * Permette all'utente di copiare il testo
 * @param testo il testo  da copiare
 */
async function copia(testo: string) {
  try {
    await navigator.clipboard.writeText(testo);
  } catch (e) {
    console.error(e);
  }
}
</script>

<style>
</style>