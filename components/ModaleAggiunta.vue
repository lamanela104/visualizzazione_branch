<template>
  <BButton @click="apriModale()">Aggiungi</BButton>
  <BModal v-model="modaleAperto" hide-footer title="Aggiungi record">
    <BForm @submit.prevent="aggiungi()" @reset="nascondiModale()">
      <BFormGroup>
        <BFormInput v-model="elemento.environment" :state="validEnvironment()" trim />
      </BFormGroup>
      <BFormGroup>
        <BFormInput v-model="elemento.branch" placeholder="./" trim />
      </BFormGroup>
      <BRow>
        <BCol>
          <BButton type="submit" variant="primary">Aggiungi</BButton>
        </BCol>
        <BCol>
          <BButton type="reset" variant="danger">Chiudi</BButton>
        </BCol>
      </BRow>
    </BForm>
  </BModal>
</template>

<script setup lang="ts">

import axios from 'axios';
import type { EnvironmentT, TableRowT } from 'typings';

type PropsT = {
  onRefresh: () => Promise<void>
}


const modaleAperto = ref(false)
const props = defineProps<PropsT>();
const elemento = reactive<EnvironmentT>({
  environment: "", path: ""
})

function apriModale() {
  modaleAperto.value = true;
}

function nascondiModale() {
  modaleAperto.value = false;
  elemento.path = ""
  elemento.environment = "";
}

async function aggiungi(): Promise<void> {
  const response = await axios.post("/api/environment", elemento);
  if (response.status < 300 && response.status >= 200) { // se status == 2XX, stato OK
    props.onRefresh?.apply(null, []) // Chiama la funzione con null-safety
    nascondiModale()
  } else {
    console.error(response)
  }
}

function validEnvironment() {
  return elemento.environment.length <= 10 && elemento.environment.length !== 0
}
</script>