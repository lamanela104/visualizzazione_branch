<template>
  <b-alert v-model="props.erroreVisibile" variant="warning" dismissible fade>
    {{ props.errore }}
  </b-alert>
</template>

<script setup lang="ts">
interface PropsT {
    errore: string
    erroreVisibile: boolean
}
const props: PropsT = defineProps<PropsT>();
</script>