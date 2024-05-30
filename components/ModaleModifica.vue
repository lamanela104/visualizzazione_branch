<template>
	<BButton variant="warning" size="sm" class="mr-1" @click="apriModale()"> Modifica </BButton>
	<BModal v-model="modaleAperto" hide-footer title="Using Component Methods">
		<BForm @submit.prevent="modifica()" @reset="nascondiModale()">
			<BFormGroup>
				<BFormInput v-model="elemento.path" placeholder="./" />
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
</template>

<script setup lang="ts">
import axios from 'axios';
import { defineProps } from '@vue/runtime-core/index'
import type { EnvironmentT } from 'typings';
type PropT = {
	onRefresh: () => void,
	elemento: EnvironmentT,
	indice: number
}

const modaleAperto = ref(false)
const elemento = reactive<EnvironmentT>({ path: "", environment: "", url: "" })

let props: PropT = defineProps<PropT>()

onMounted(() => {
	elemento.path = props.elemento.path ?? ""
	elemento.environment = props.elemento.environment ?? ""
	
})
function apriModale() {
	modaleAperto.value = true
}
function nascondiModale() {
	modaleAperto.value = false;
	elemento.path = props.elemento.path ?? ""
}

async function modifica(): Promise<void> {
	const response = await axios.put("/api/environment", elemento);

	if (response.status < 300 && response.status >= 200) { // se status == 2XX
		props.onRefresh?.apply(null, [])
		nascondiModale()
	} else {
		console.error(response)
	}
}
</script>