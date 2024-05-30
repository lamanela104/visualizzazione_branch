<template>
  <div>
    <BTable striped hover :fields="campiTabella" :items="dati">

      <template #cell(environment)="row">
        <BLink href="{{ row.item.url }}">
          {{ row.item.environment }}
        </BLink>
      </template>
      <template #cell(branch)="row">
        {{ row.item.branch }}
      </template>
      <template #cell(path)="row">
        {{ row.item.path }}
      </template>
      <template #cell(actions)="row">
        <ModaleModifica :elemento="row.item" :indice="row.index" @refresh="ottieniDati"> Modifica </ModaleModifica>
        <ModaleElimina :elemento="row.item" :indice="row.index" @refresh="ottieniDati">Elimina</ModaleElimina>
      </template>
    </BTable>

    <BRow>
      <BCol>
        <BButton variant="primary" @click="ottieniDati">Ricarica</BButton>
      </BCol>
      <BCol>
        <BButton variant="primary" @click="ottieniDatiAPI">API</BButton>
      </BCol>
      <BCol>
        <ModaleAggiunta @refresh="ottieniDati" />
      </BCol>
    </BRow>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import type { TableFieldRaw } from "bootstrap-vue/typings";
import type { EnvironmentT, TableRowT } from "typings";

const dati = ref<EnvironmentT[]>([]);

const campiTabella: TableFieldRaw<EnvironmentT>[] = [
  {
    key: 'environment',
    label: 'Environment',
    sortable: true,
    sortDirection: 'desc',
  },
  {
    key: 'path',
    label: 'Path',
    sortable: true,
    sortDirection: 'desc',
  },
  {
    key: 'branch',
    label: 'Branch',
    sortable: true,
    sortDirection: 'desc',
  },
  {
    key: 'actions',
    label: 'Actions'
  },
]

async function ottieniDati(): Promise<void> {
  const response = await axios.get<EnvironmentT[]>("/api/environment")
  if (response.status === 200) {
    console.log(response.data);
    dati.value = response.data;
  } else {
    console.error(response)
  }
}

async function ottieniDatiAPI(): Promise<void> {
  // const response = await axios.get("api/apifetch")
  // if (response.status === 200) {
  //   console.log(response.data)
  // } else {
  //   console.error(response.statusText)
  // }
  alert("Not implemented")
}

onMounted(ottieniDati);
</script>

<style lang="scss" scoped></style>