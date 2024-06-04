<template>
  <b-container>
    <b-row>
      <!-- La tabella che contiene tutti i dati visualizzati -->
      <TabellaDati v-model="dati" @refresh="ottieniDati" />
    </b-row>
    <b-row align-h="around">
      <b-col cols="4" class="center" size="lg">
        <b-button size="lg" variant="primary" @click="ottieniDati">
          Ricarica
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
      
<script setup lang="ts">
import axios from "axios";
import type { TableFieldRaw } from "bootstrap-vue/typings";
import type { DataT } from "typings";


const dati = ref<DataT>({environment: [], branches: []});
/**
 * Chiama "GET /api/environment", per ottenere i dati
 * @returns i dati ottenuti dalla richiesta, `dati` è automaticamente aggiornato. Ritorna `undefined` se la richiesta da un qualsiasi errore.
 */
async function ottieniDati(): Promise<DataT | undefined> {
  let response;
  try {
    response = await axios.get<DataT>("/api/environment");
    if (response.status === 200) {
      dati.value = response.data;
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
