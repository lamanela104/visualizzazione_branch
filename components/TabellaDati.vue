<template>
  <b-table
    striped
    hover
    :fields="campiTabella"
    :items="dati.environments"
    responsive
    :busy="isBusy"
    class="data-table"
  >
    <!-- Scritta dell'environment -->
    <template #cell(environment)="row">
      <b-row>
        <b-col cols="12" md="8">
          <b-link :href="`${row.item.environmentURL}`">
            {{ row.item.environment }}
          </b-link>
        </b-col>
        <b-col cols="12" md="4" class="text-md-right">
          <ModaleDeploy v-model="row.item" @refresh="refresh()" />
        </b-col>
      </b-row>
    </template>

    <!-- Scritta della branch -->
    <template #cell(branch)="row">
      <b-row>
        <b-col cols="12" md="8">
          <b-link :href="row.item.branchURL">
            {{ row.item.branch }}
          </b-link>
        </b-col>
        <b-col cols="12" md="4" class="text-md-right">
          <ModaleModifica
            v-model="row.item"
            :branches="dati.branches"
            @refresh="refresh()"
          />
        </b-col>
      </b-row>
    </template>

    <!-- Bottoni che permettono l'interazione con un record -->
    <template #cell(commit)="row">
      <b-row>
        <b-col cols="12" md="8">
          {{ writeDate(row.value.date) }}
        </b-col>
        <b-col cols="12" md="4" class="text-md-right">
          <ModaleDettagli v-model="row.item" />
        </b-col>
      </b-row>
    </template>
  </b-table>
</template>

<script setup lang="ts">
import type { FrontendDataT, FieldT } from "typings";
import type { TableFieldRaw } from "bootstrap-vue/typings";
interface EmitsT {
  (e: "refresh"): Promise<FrontendDataT | undefined>;
}

const dati = defineModel<FrontendDataT>();
const emits = defineEmits<EmitsT>();

const isBusy = ref(false);

const campiTabella: TableFieldRaw<FieldT>[] = [
  {
    key: "environment",
    label: "Ambiente",
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
    key: "commit",
    label: "Commit",
    sortable: true,
    sortDirection: "desc",
  },
];

async function refresh() {
  if (isBusy.value) return;
  isBusy.value = true;
  let values = await emits("refresh");
  isBusy.value = false;
  return values;
}
function writeDate(date: string | number | Date): string {
  date = new Date(date);
  return Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}
</script>

<style lang="scss" scoped>
.data-table {
  overflow-x: hidden;
}
</style>