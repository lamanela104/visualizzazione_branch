<template>
  <BAlert v-model="props.erroreVisibile" variant="warning" dismissible fade>
    {{ props.errore }}
  </BAlert>
</template>

<script setup lang="ts">
interface PropsT {
    errore: string
    erroreVisibile: boolean
}
const props: PropsT = defineProps<PropsT>();
</script>