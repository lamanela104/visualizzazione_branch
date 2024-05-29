<template>
	<BButton size="sm" class="mr-1" @click="apriModale()"> Modifica </BButton>
	<BModal v-model="modaleAperto" hide-footer title="Using Component Methods">
		<BForm @submit.prevent="modifica()" @reset="nascondiModale()">
			<BFormGroup>
				<BFormInput v-model="elemento.branch" placeholder="MASTER"/>
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
import type { TableRowT } from 'typings';
type PropT = {
	onRefresh: () => void,
	elemento: TableRowT,
	indice: number
}

const modaleAperto = ref(false)
const elemento = reactive<TableRowT>({ branch: "", environment: "" })

let props: PropT = defineProps<PropT>()

onMounted(() => {
	elemento.branch = props.elemento.branch ?? ""
	elemento.environment = props.elemento.environment ?? ""
})
function apriModale() {
	modaleAperto.value = true
}
function nascondiModale() {
	modaleAperto.value = false;
	elemento.branch = props.elemento.branch ?? ""
	elemento.environment = props.elemento.environment ?? ""
}

async function modifica(): Promise<void> {
	const response = await axios.put("/api/branch", elemento);

	if (Math.floor(response.data.status / 100) === 2) { // se status == 2XX
		props.onRefresh?.apply(null, [])
		nascondiModale()
	} else {
		console.error(response)
	}
}
</script>