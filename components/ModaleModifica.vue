<template>
  <b-button variant="warning" size="sm" class="mr-1" @click="apriModale()">
    <b-img
      src="modifica.svg"
      fluid-grow
      class="m1 button-image"
    />
  </b-button>
  
  <b-modal v-model="modaleAperto" hide-footer title="Modifica branch">
    <b-form @submit.prevent="modifica()" @reset="nascondiModale()">
      <!-- Branches -->
      <b-form-group>
        <b-form-select v-model="selezionato">
          <b-form-select-option
            v-for="(value, key) in props.branches"
            :value="value.name"
            :key="key"
          >
            {{ value.name }}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>
      <!-- Buttons -->
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
      <!-- Error alert -->
      <b-form-group>
        <b-alert v-model="erroreVisibile" variant="warning" dismissible fade>
          <b-row>
            <b-col class="center">
              <div>
                {{ errore }}
              </div>
            </b-col>
          </b-row>
        </b-alert>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script setup lang="ts">
import axios from "axios";
import type { BranchT, FieldT } from "typings";

interface PropT {
  onRefresh(): void;
  branches: BranchT[];
}

const erroreVisibile = ref(false);
const chiediConferma = ref(false);
const modaleAperto = ref(false);
const selezionato = ref("");
const errore = ref("");

const props: PropT = defineProps<PropT>();
const model = defineModel<FieldT>();

onMounted(() => {
  selezionato.value = model.value.branch;
});
function apriModale() {
  modaleAperto.value = true;
  erroreVisibile.value = false;
  errore.value = "";
  chiediConferma.value = false;
}
function nascondiModale() {
  modaleAperto.value = false;
}
let sentModifica = false;
async function modifica(force?: boolean) {
  if (sentModifica) return;
  sentModifica = true;
  try {
    const response = await axios.put<never>("/api/branch", {
      ID: model.value.ID,
      force: force,
    });
    if (response.status < 300 && response.status >= 200) {
      console.log(response);

      props.onRefresh?.apply(null);
      nascondiModale();
    } else {
      mostraErrore(response.statusText, response.status);
    }
  } catch (e: any) {
    mostraErrore(e.response.statusText);
  } finally {
    sentModifica = false;
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