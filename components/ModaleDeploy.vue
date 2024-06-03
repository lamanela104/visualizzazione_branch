<template>
  <b-button variant="danger" size="sm" class="mr-1" @click="apriModale()">
    Deploy
  </b-button>
  <b-modal
    v-model="modaleAperto"
    hide-footer
    title="Sicuro di voler fare il deploy?"
  >
    <b-form @submit.prevent="deploy()" @reset="nascondiModale()">
      <b-row>
        <b-col>
          <b-button type="submit" variant="primary">Si</b-button>
        </b-col>
        <b-col>
          <b-button type="reset" variant="danger">No</b-button>
        </b-col>
        <b-col>
          <b-button type="reset" variant="secondary">Annulla</b-button>
        </b-col>
      </b-row>
    </b-form>
    <AlertErrore :errore="errore" :erroreVisibile="erroreVisibile" />
  </b-modal>
</template>

<script setup lang="ts">
import axios from "axios";
import type { EnvironmentT } from "typings";

const erroreVisibile = ref(false);
const modaleAperto = ref(false);
const errore = ref("");

const model = defineModel();

function apriModale() {
  modaleAperto.value = true;
}
function nascondiModale() {
  modaleAperto.value = false;
}

async function deploy() {
  console.log(model.value);
  
  try {
    const response = await axios.post("/api/deploy", {
      ID: model.value.ID,

    });
    if (response.status < 300 && response.status >= 200) {
      nascondiModale();
    } else {
      mostraErrore(response.statusText);
    }
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