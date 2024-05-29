<template>
  <div>
    <BTable striped hover :fields="campiTabella" :items="dati">

      <template #cell(environment)="row">
        {{ row.item.environment }}
      </template>
      <template #cell(branch)="row">
        {{ row.item.branch }}
      </template>
      <template #cell(actions)="row">
        <ModaleModifica :elemento="row.item" :indice="row.index" @refresh="ottieniDati"> Modifica </ModaleModifica>
        <ModaleElimina :elemento="row.item" :indice="row.index" @refresh="ottieniDati">Elimina</ModaleElimina>
      </template>

    </BTable>
    <BButton @click="ottieniDati()">Ricarica</BButton>
    <ModaleAggiunta @refresh="ottieniDati" />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import type { TableFieldRaw } from "bootstrap-vue/typings";
import type { TableRowT } from "typings";

const dati = ref<TableRowT[]>([]);

const campiTabella: TableFieldRaw<TableRowT>[] = [
  {
    key: 'environment',
    label: 'Environment',
    sortable: true,
    sortDirection: 'desc',
  },
  {
    key: 'branch',
    label: 'Branch',
    sortable: true,
    sortDirection: 'desc',
  },
  { key: 'actions', label: 'Actions' },
]

async function ottieniDati(): Promise<void> {
  const response = await axios.get("/api/branch")
  dati.value = response.data
}

onMounted(ottieniDati);

</script>