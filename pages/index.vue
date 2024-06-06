<template>
  <Navbar @refresh="ottieniDati" />
  <!-- La tabella che contiene tutti i dati visualizzati -->
  <TabellaDati v-model="dati" @refresh="ottieniDati" />
</template>
      
<script setup lang="ts">
import axios from "axios";
import type { TableFieldRaw } from "bootstrap-vue/typings";
import type { FrontendDataT } from "typings";

const dati: FrontendDataT = reactive<FrontendDataT>({
  environment: [],
  branches: [],
});
/**
 * Chiama "GET /api/environment", per ottenere i dati
 * @returns i dati ottenuti dalla richiesta, `dati` è automaticamente aggiornato. Ritorna `undefined` se la richiesta da un qualsiasi errore.
 */
async function ottieniDati(): Promise<FrontendDataT | undefined> {
  let response;
  try {
    response = await axios.get<FrontendDataT>("/api/environment");
    if (response.status === 200) {
      dati.branches = response.data.branches;
      dati.environments = response.data.environments;

      console.log(response.data);
      return response.data;
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
onMounted(ottieniDati);
</script>
