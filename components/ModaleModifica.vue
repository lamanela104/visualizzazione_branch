<template>
  <b-button variant="warning" size="sm" class="mr-1" @click="apriModale()">
    Modifica
  </b-button>
  <b-modal v-model="modaleAperto" hide-footer title="Using Component Methods">
    <b-form @submit.prevent="modifica()" @reset="nascondiModale()">
      <b-form-group>
        <b-form-select v-model="selezionato">
          <b-form-select-option
            v-for="(value, key) in model.branches"
            :value="value.name"
            :key="key"
          >
            {{ value.name }}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>
      <AlertErrore :errore="errore" :erroreVisibile="erroreVisibile" />
      <b-form-group>
        <b-row>
          <b-col>
            <b-button type="submit" variant="primary">Modifica</b-button>
          </b-col>
          <b-col>
            <b-button type="reset" variant="danger">Chiudi</b-button>
          </b-col>
        </b-row>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script setup lang="ts">
import axios from "axios";
import { defineProps } from "@vue/runtime-core/index";
import type { EnvironmentT } from "typings";
import { validPath } from "../utils/front";

type PropT = {
  onRefresh: () => void;
  elemento: EnvironmentT;
  indice: number;
};

const selezionato = ref("");
const errore = ref<string>("");
const erroreVisibile = ref<boolean>(false);

const modaleAperto = ref(false);

const model = defineModel()
let props: PropT = defineProps<PropT>();

onMounted(() => {
  selezionato.value = props.elemento.branch;
});
function apriModale() {
  modaleAperto.value = true;
}
function nascondiModale() {
  modaleAperto.value = false;
}

async function modifica(): Promise<void> {
  console.log(props.elemento);
  
  try {
    const response = await axios.put("/api/environment", {
      id: props.elemento.ID,
      environment: props.elemento.environment,
      branch: selezionato.value,
    });

    if (response.status < 300 && response.status >= 200) {
      // se status == 2XX
      props.onRefresh?.apply(null);
      nascondiModale();
    } else mostraErrore(response.statusText);
  } catch (e: any) {
    mostraErrore(e.response.statusText);
  }
}
function mostraErrore(reason: string) {
  errore.value = reason;
  erroreVisibile.value = true;
  console.warn({ ...errore, ...erroreVisibile });
}
</script>