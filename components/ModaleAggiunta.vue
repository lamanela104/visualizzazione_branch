<template>
  <b-button size="lg" @click="apriModale()">Aggiungi</b-button>
  <b-modal
    v-model="modaleAperto"
    hide-footer
    title="Aggiungi record"
    @close="erroreVisibile = false"
  >
    <b-form @submit.prevent="aggiungi()" @reset="nascondiModale()">
      <b-form-group>
        <b-form-input
          v-model="elemento.environment"
          :state="validEnvironment(elemento.environment, props.dati)"
          trim
        />
      </b-form-group>
      <b-form-group>
        <b-form-input
          v-model="elemento.path"
          placeholder="./"
          trim
          :state="validPath(elemento, props.dati)"
        />
      </b-form-group>
      <b-row>
        <b-col size="lg">
          <b-button size="lg" type="submit" variant="primary"
            >Aggiungi</b-button
          >
        </b-col>
        <b-col size="lg">
          <b-button size="lg" type="reset" variant="danger">Chiudi</b-button>
        </b-col>
      </b-row>
    </b-form>
    <AlertErrore :errore="errore" :erroreVisibile="erroreVisibile" />
  </b-modal>
</template>

<script setup lang="ts">
import axios from "axios";
import type { AddEnvironmentObjectT, EnvironmentT } from "typings";
import { validPath, validEnvironment } from '../utils/front'

type PropsT = {
  onRefresh: () => Promise<void>;
  dati: EnvironmentT[];
};
const errore = ref<string>("");
const erroreVisibile = ref<boolean>(false);
const modaleAperto = ref(false);
const props: PropsT = defineProps<PropsT>();
const elemento: AddEnvironmentObjectT = reactive<AddEnvironmentObjectT>({
  environment: "",
  path: ""
});

function apriModale() {
  modaleAperto.value = true;
}

function nascondiModale() {
  modaleAperto.value = false;
  elemento.path = "";
  elemento.environment = "";
}

async function aggiungi(): Promise<void> {
  try {
    const response = await axios.post("/api/environment", elemento);
    if (response.status < 300 && response.status >= 200) {
      // se status == 2XX, stato OK
      props.onRefresh?.apply(null, []); // Chiama la funzione con null-safety
      nascondiModale();
    } else {
      mostraErrore(response.statusText);
    }
  } catch (e: any) {
    mostraErrore(e.response.statusText);
    console.error(e);
  }
}
function mostraErrore(reason: string) {
  errore.value = reason;
  erroreVisibile.value = true;
  console.warn({ ...errore, ...erroreVisibile });
}



</script>