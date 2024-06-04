<template>
  <b-table
    striped
    hover
    :fields="campiTabella"
    :items="dati.environments"
    responsive
  >
    <!-- Scritta della branch -->
    <template #cell(branch)="row">
      <b-link :href="`${row.item.url}`">
        {{ row.item.branch }}
      </b-link>
    </template>
    <!-- Bottoni che permettono l'interazione con un record -->
    <template #cell(actions)="row">
      <b-row align-h="center">
        <b-col class="center">
          <ModaleDettagli v-model="row.item" />
        </b-col>
        <b-col class="center">
          <ModaleModifica
            :elemento="row.item"
            :indice="row.index"
            v-model="dati"
            @refresh="props.onRefresh"
          />
        </b-col>
        <b-col>
          <ModaleDeploy
            v-if="row.item.deploy_path"
            v-model="row.item"
            @refresh="props.onRefresh"
          />
        </b-col>
      </b-row>
    </template>
  </b-table>
</template>

<script setup lang="ts">
import type { DataT, EnvironmentT } from "typings";
import type { TableFieldRaw } from "bootstrap-vue/typings";

type PropT = {
  readonly onRefresh: () => Promise<DataT>;
};
const dati = defineModel<DataT>();
const props: PropT = defineProps<PropT>();
const campiTabella: TableFieldRaw<EnvironmentT>[] = [
  {
    key: "environment",
    label: "Environment",
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
</script>