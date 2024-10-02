<template>
  <div class="folder-path-input">
    <InputText type="text" v-model="folderPath" readonly="true" style="min-width: 60%;"/>
    <Button label="Browse" @click="getFolderPath" severity="success" />
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { ref } from 'vue';

const folderPath = ref("")

const getFolderPath = () => {
  window.electronAPI.ipcRenderer.invoke('select-directory', 'export').then((path: string) => {
    folderPath.value = path
  })
}

</script>

<style scoped>
.folder-path-input{
  color: white;
}
</style>