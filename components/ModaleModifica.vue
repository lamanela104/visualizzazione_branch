<template>
  <BButton variant="warning" size="sm" class="mr-1" @click="apriModale()">
    Modifica
  </BButton>
  <BModal v-model="modaleAperto" hide-footer title="Using Component Methods">
    <BForm @submit.prevent="modifica()" @reset="nascondiModale()">
      <BFormGroup>
        <BFormInput
          v-model="elemento.path"
          placeholder="./"
          trim
          :state="validPath(elemento, props.dati)"
        />
      </BFormGroup>
      <BRow>
        <BCol>
          <BButton type="submit" variant="primary">Modifica</BButton>
        </BCol>
        <BCol>
          <BButton type="reset" variant="danger">Chiudi</BButton>
        </BCol>
      </BRow>
    </BForm>
  </BModal>
  <AlertErrore :errore="errore" :erroreVisibile="erroreVisibile" />
</template>

<script setup lang="ts">
import axios from "axios";
import { defineProps } from "@vue/runtime-core/index";
import type { EnvironmentT } from "typings";
import { validPath } from '../utils/front'

type PropT = {
  onRefresh: () => void;
  elemento: EnvironmentT;
  indice: number;
  dati: EnvironmentT[];
};

const errore = ref<string>("");
const erroreVisibile = ref<boolean>(false);

const modaleAperto = ref(false);
const elemento = reactive<EnvironmentT>({ path: "", environment: "", url: "" });

let props: PropT = defineProps<PropT>();

onMounted(() => {
  elemento.path = props.elemento.path ?? "";
  elemento.environment = props.elemento.environment ?? "";
});
function apriModale() {
  modaleAperto.value = true;
}
function nascondiModale() {
  modaleAperto.value = false;
  elemento.path = props.elemento.path ?? "";
}

async function modifica(): Promise<void> {
  try {
    const response = await axios.put("/api/environment", elemento);

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