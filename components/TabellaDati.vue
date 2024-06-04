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
      <b-link :href="`${row.item.branchURL}`">
        {{ row.item.branch }}
      </b-link>
    </template>
    <!-- Scritta della branch -->
    <template #cell(environment)="row">
      <b-link :href="`${row.item.environmentURL}`">
        {{ row.item.environment }}
      </b-link>
    </template>
    <!-- Bottoni che permettono l'interazione con un record -->
    <template #cell(actions)="row">
      <b-row align-h="center">
        <b-col class="center">
          <ModaleDettagli v-model="row.item" />
        </b-col>
        <b-col>
          <ModaleDeploy v-model="row.item" @refresh="props.onRefresh" />
        </b-col>
      </b-row>
    </template>
  </b-table>
</template>

<script setup lang="ts">
import type { FrontendDataT, FieldT } from "typings";
import type { TableFieldRaw } from "bootstrap-vue/typings";

interface PropT {
  onRefresh(): Promise<FrontendDataT>;
}
const dati = defineModel<FrontendDataT>();
const props: PropT = defineProps<PropT>();
const campiTabella: TableFieldRaw<FieldT>[] = [
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