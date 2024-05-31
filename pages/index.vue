<template>
  <b-container>
    <b-table striped hover :fields="campiTabella" :items="dati" responsive>
      <template #cell(environment)="row">
        {{ row.item.environment }}
      </template>
      <template #cell(branch)="row">
        <b-link :href="`${row.item.url}`">
          {{ row.item.branch }}
        </b-link>
      </template>
      <template #cell(path)="row">
        {{ row.item.path }}
      </template>
      <!-- Bottoni che permettono l'interazione con un record -->
      <template #cell(actions)="row">
        <b-row align-h="center">
          <b-col class="center">
            <b-button
              size="sm"
              class="mr-1"
              variant="info"
              @click="row.toggleDetails"
              >{{ row.detailsShowing ? "Chiudi" : "Mostra" }} Dettagli</b-button
            >
          </b-col>
          <b-col class="center">
            <ModaleModifica
              :elemento="row.item"
              :indice="row.index"
              :dati="dati"
              @refresh="ottieniDati"
            />
          </b-col>
          <b-col class="center">
            <ModaleElimina
              :elemento="row.item"
              :indice="row.index"
              @refresh="ottieniDati"
            />
          </b-col>
        </b-row>
      </template>
      <!-- Dettagli sull'ultimo commit -->
      <template #row-details="row">
        <b-card title="Informazioni dell'ultimo commit">
          <b-list-group>
            <b-list-group-item
              button
              v-for="(value, key) in row.item.commit"
              :key="key"
              @click="copia(row.item, key)"
            >
              {{ key }}: {{ value }}
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </template>
    </b-table>

    <b-row align-h="around">
      <b-col cols="4" class="center" size="lg">
        <b-button size="lg" variant="primary" @click="ottieniDati"
          >Ricarica</b-button
        >
      </b-col>
      <b-col cols="4" class="center" size="lg">
        <b-button size="lg" variant="primary" @click="ottieniDatiAPI"
          >API</b-button
        >
      </b-col>
      <b-col cols="4" class="center" size="lg">
        <ModaleAggiunta @refresh="ottieniDati" :dati="dati" />
      </b-col>
    </b-row>
  </b-container>
</template>
      
  <script setup lang="ts">
import axios from "axios";
import type { TableFieldRaw } from "bootstrap-vue/typings";
import type { EnvironmentT } from "typings";

const dati = ref<EnvironmentT[]>([]);

const campiTabella: TableFieldRaw<EnvironmentT>[] = [
  {
    key: "environment",
    label: "Environment",
    sortable: true,
    sortDirection: "desc",
  },
  {
    key: "path",
    label: "Path",
    sortable: true,
    sortDirection: "desc",
  },
  {
    key: "branch",
    label: "Branch",
    sortable: true,
    sortDirection: "desc",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

async function ottieniDati(): Promise<void> {
  const response = await axios.get<EnvironmentT[]>("/api/environment");
  if (response.status === 200) {
    console.log(response.data);
    dati.value = response.data;
  } else {
    console.error(response);
  }
}

async function ottieniDatiAPI(): Promise<void> {
  // const response = await axios.get("api/apifetch")
  // if (response.status === 200) {
  //   console.log(response.data)
  // } else {
  //   console.error(response.statusText)
  // }
  alert("Not implemented");
}
async function copia(
  elemento: EnvironmentT,
  key: keyof EnvironmentT["commit"]
) {
  if (!elemento.commit) return;
  try {
    await navigator.clipboard.writeText(elemento.commit[key]);
  } catch (e) {
    console.error(e);
  }
}
onMounted(ottieniDati);
</script>
