<template>
  <BButton variant="danger" size="sm" class="mr-1" @click="apriModale()">Elimina</BButton>
  <BModal v-model="modaleAperto" hide-footer title="Sicuro di voler eliminare il record?">
    <BForm @submit.prevent="elimina()" @reset="nascondiModale()">
      <BRow>
        <BCol>
          <BButton type="submit" variant="primary">Si</BButton>
        </BCol>
        <BCol>
          <BButton type="reset" variant="danger">No</BButton>
        </BCol>
        <BCol>
          <BButton type="reset" variant="secondary">Annulla</BButton>
        </BCol>
      </BRow>
    </BForm>
  </BModal>
</template>

<script setup lang="ts">

import axios from 'axios';
import type { EnvironmentT } from 'typings';
type PropT = {
  onRefresh: () => void,
  elemento: EnvironmentT,
  indice: number
}

const modaleAperto = ref(false)

let props: PropT = defineProps<PropT>()

function apriModale() {
  modaleAperto.value = true
}
function nascondiModale() {
  modaleAperto.value = false;
}

async function elimina() {
  const response = await axios.delete("/api/environment", {
    params: props.elemento
  });
  if (response.status < 300 && response.status >= 200) { // se status == 200 o 201, stato OK
    props.onRefresh?.apply(null, []) // Chiama la funzione con null-safety
    nascondiModale()
  } else {
    console.error(response);
  }
}
</script>