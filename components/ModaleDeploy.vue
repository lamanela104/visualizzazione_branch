<template>
  <b-button variant="danger" size="sm" class="mr-1" @click="apriModale()">
    Deploy
    <b-img src="deploy.svg" fluid-grow class="m1 button-image" />
  </b-button>
  <b-modal
    v-model="modaleAperto"
    hide-footer
    title="Sicuro di voler eseguire il deploy?"
    @show="reset"
  >
    <b-form @submit.prevent="deploy()" @reset="nascondiModale()">
      <!-- Bottoni per mandare il deploy -->
      <b-form-group>
        <b-row>
          <b-col class="center">
            <b-button type="submit" variant="primary"> Si </b-button>
          </b-col>
          <b-col class="center">
            <b-button type="reset" variant="danger"> No </b-button>
          </b-col>
          <b-col class="center">
            <b-button type="reset" variant="secondary"> Annulla </b-button>
          </b-col>
        </b-row>
      </b-form-group>
      <!-- In caso di errore -->
      <b-form-group>
        <b-alert v-model="erroreVisibile" variant="warning" dismissible fade>
          <b-row>
            <b-col class="center">{{ errore }}</b-col>
          </b-row>
          <!-- Se l'errore è causato dalla condizione dei file senza commit -->
          <b-row v-if="chiediConferma">
            <b-col>
              <!-- Rimuovi forzatamente -->
              <b-button variant="danger" class="center" @click="deploy(true)">
                Rimuovi
              </b-button>
            </b-col>
            <b-col>
              <!-- Annulla -->
              <b-button variant="secondary" class="center" type="reset">
                Annulla
              </b-button>
            </b-col>
          </b-row>
        </b-alert>
      </b-form-group>

      <b-alert
        v-model="deployerOutputVisible"
        variant="light"
        dismissible
        fade
        @dismissed="nascondiModale()"
      >
        <div v-html="deployerOutput"></div>
      </b-alert>
    </b-form>
  </b-modal>
</template>

<script setup lang="ts">
import axios from "axios";
import type { FieldT, FrontendDataT, SpawnedValue } from "typings";
interface EmitsT {
  (e: "refresh"): Promise<FrontendDataT | undefined>;
}

const modaleAperto = ref(false);

const erroreVisibile = ref(false);
const errore = ref("");
const chiediConferma = ref(false);

const deployerOutput = ref("");
const deployerOutputVisible = ref(false);

const emits = defineEmits<EmitsT>();
const model = defineModel<FieldT>();
let modifica = false;
async function refresh() {
  await emits("refresh");
}
function apriModale() {
  modaleAperto.value = true;
}
function nascondiModale() {
  modaleAperto.value = false;
}
function reset() {
  erroreVisibile.value = false;
  errore.value = "";
  chiediConferma.value = false;

  deployerOutput.value = "";
  deployerOutputVisible.value = false;
  if (modifica) refresh();
  modifica = false;
}
let sentDeploy = false;
async function deploy() {
  if (sentDeploy) return;
  sentDeploy = true;
  try {
    const { status, statusText } = await axios.get("/api/checkdeploy", {
      params: { ID: model.value.ID },
    });
    if (status < 200 || status > 299) {
      sentDeploy = false;
      return;
    }
  } catch {
    sentDeploy = false;
    return;
  }
  
  const sse = new EventSource(`/api/deploy?ID=${model.value.ID}`);
  deployerOutput.value = ""
  deployerOutputVisible.value = true;
  sse.onopen = (ev) => {
    console.log("openEvent", ev);
  };
  sse.onmessage = (ev: MessageEvent<string>) => {
    modifica = true;
    const data: SpawnedValue = JSON.parse(ev.data);
    console.table(data);

    switch (data.event) {
      case "error":
        mostraErrore(data.body.message);
      case "spawn":
        break;
      case "close":
        sentDeploy = false;
        return;
      case "stderr":
        deployerOutput.value += `<div class="stderr">${data.body}</div>`;
        break;
      case "stdout":
        deployerOutput.value += `<div class="stdout">${data.body}</div>`;
        break;
    }
  };
  sse.onerror = (ev) => {
    console.warn(ev);
    sentDeploy = false;
    refresh();
  };
}
function mostraErrore(reason: string, code?: number) {
  errore.value = reason;
  erroreVisibile.value = true;
  if (code === 299) {
    chiediConferma.value = true;
  }
  console.warn({ ...errore, ...erroreVisibile });
}
</script>

<style lang="scss" scoped>
.stdout {
  color: #111 !important; 
}
.stderr {
  color: #b00 !important;
}
</style>