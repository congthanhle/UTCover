<script setup lang="ts">
import ItemList from './components/ItemList.vue';
window.electronAPI.sendMessage('Hello from App.vue!');

</script>

<template>
  <ItemList style="margin-top: 20px;"/>
</template>

<style scoped></style>
