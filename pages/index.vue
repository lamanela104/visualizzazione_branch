<template>
  <b-container>
    <b-row>
      <TabellaDati v-model="dati" @refresh="ottieniDati" />
    </b-row>
    <b-row align-h="around">
      <b-col cols="4" class="center" size="lg">
        <b-button size="lg" variant="primary" @click="ottieniDati">
          Ricarica
        </b-button>
      </b-col>
      <!-- 
      <b-col cols="4" class="center" size="lg">
        <ModaleAggiunta @refresh="ottieniDati" v-model="dati" />
      </b-col>
         -->
    </b-row>
  </b-container>
</template>
      
<script setup lang="ts">
import axios from "axios";
import type { TableFieldRaw } from "bootstrap-vue/typings";
import type { DataT, EnvironmentT } from "typings";

const dati: { value: DataT } = ref<DataT>({});
async function ottieniDati(): Promise<DataT | undefined> {
  const response = await axios.get<DataT>("/api/environment");
  if (response.status === 200) {
    console.log(response.data);
    dati.value = response.data;
    return response.data;
  } else {
    console.error(response);
  }
  return undefined;
}
onMounted(ottieniDati);
</script>
