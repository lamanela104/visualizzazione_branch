<template>
  <b-button variant="danger" size="sm" class="mr-1" @click="apriModale()">
    Deploy
  </b-button>
  <b-modal
    v-model="modaleAperto"
    hide-footer
    title="Sicuro di voler eseguire il deploy?"
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
    <b-alert v-model="erroreVisibile" variant="warning" dismissible fade>
      <b-row>
        <b-col class="center">{{ errore }}</b-col>
      </b-row>
      <b-row v-if="errore.startsWith('File senza commit trovati')">
        <b-col>
          <b-button variant="danger" class="center" @click="deploy(true)">
            Rimuovi
          </b-button>
        </b-col>
        <b-col>
          <b-button
            variant="secondary"
            class="center"
            @click="
              erroreVisibile = false;
              nascondiModale();
            "
          >
            Annulla
          </b-button>
        </b-col>
      </b-row>
    </b-alert>
  </b-modal>
</template>

<script setup lang="ts">
import axios from "axios";
import type { EnvironmentT } from "typings";

interface PropT {
  onRefresh(): void;
}

const erroreVisibile = ref(false);
const modaleAperto = ref(false);
const errore = ref("");

const props: PropT = defineProps<PropT>();

const model = defineModel();

function apriModale() {
  modaleAperto.value = true;
}
function nascondiModale() {
  modaleAperto.value = false;
  erroreVisibile.value = false;
}

async function deploy(force?: boolean) {
  console.log(model.value);

  try {
    const response = await axios.post("/api/deploy", {
      ID: model.value.ID,
      force: force
    });
    if (response.status < 300 && response.status >= 200) {
      nascondiModale();
      props.onRefresh?.apply(null);
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