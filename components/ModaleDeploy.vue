<template>
  <b-button variant="danger" size="sm" class="mr-1" @click="apriModale()">
    Deploy
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
      <b-form-group>
        <!-- In caso di errore -->
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
        v-model="stdoutVisibile"
        variant="success"
        dismissible
        fade
        @dismissed="nascondiModale()"
      >
        <div v-html="stdout"></div>
      </b-alert>
    </b-form>
  </b-modal>
</template>

<script setup lang="ts">
import axios from "axios";
import type { FieldT, FileExecutionT } from "typings";

interface PropT {
  onRefresh(): void;
}

const erroreVisibile = ref(false);
const modaleAperto = ref(false);
const errore = ref("");
const chiediConferma = ref(false);

const stdout = ref("");
const stdoutVisibile = ref(false);

const props: PropT = defineProps<PropT>();

const model = defineModel<FieldT>();

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

  stdout.value = "";
  stdoutVisibile.value = false;
}
let sentDeploy = false;
async function deploy(force?: boolean) {
  if (sentDeploy) return;
  sentDeploy = true;
  try {
    const response = await axios.post<FileExecutionT>("/api/deploy", {
      ID: model.value.ID,
      force: force,
    });
    if (response.status < 300 && response.status >= 200) {
      console.log(response);

      stdout.value = response.data.stdout.trim().replace(/\n/g, "<br>"); // TODO gestire problema con la risposta (data = '')
      stdoutVisibile.value = true;
      props.onRefresh?.apply(null);
    } else {
      mostraErrore(response.statusText, response.status);
    }
  } catch (e: any) {
    mostraErrore(e.response.statusText);
  } finally {
    sentDeploy = false;
  }
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