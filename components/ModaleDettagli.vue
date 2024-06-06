<template>
  <b-button size="sm" class="mr-1" variant="info" @click="apriModale">
    <b-img src="details.svg" fluid-grow class="m1 button-image" />
  </b-button>
  <b-modal v-model="modaleAperto" hide-footer title="Modale dettagli">
    <!-- Dettagli sull'ultimo commit -->
    <b-card title="Informazioni dell'ultimo commit" v-if="model.commit">
      <b-list-group>
        <b-list-group-item
          v-for="(value, key) in model.commit"
          :key="key"
        >
          {{ key }}: {{ value }}
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <!-- Altri dettagli specificati dalla funzione altreInformazioni() -->
    <b-card title="Altre informazioni">
      <b-list-group>
        <b-list-group-item
          v-for="(value, key) in altreInformazioni()"
          :key="key"
        >
          {{ key }}: {{ value }}
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-modal>
</template>

<script setup lang="ts">
import type { FieldT } from "typings";

const model: { value: FieldT } = defineModel();
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
  if (model.value.deploy_path)
    infos["Percorso di Deploy"] = model.value.deploy_path;
  return infos;
}
</script>

<style>
</style>