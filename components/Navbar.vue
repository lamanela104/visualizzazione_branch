<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">Branch Manager</b-navbar-brand>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-button size="lg" variant="light" @click="refresh" right>
        Ricarica
      </b-button>
    </b-navbar-nav>
  </b-navbar>
</template>

<script setup lang="ts">
const emits = defineEmits(["refresh"]);

function refresh() {
  emits("refresh");
}
</script>