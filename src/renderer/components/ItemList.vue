<template>
  <div class="folder-path-input">
    <InputText type="text" v-model="folderPath" placeholder="Folder path" readonly="true" style="min-width: 60%;" />
    <Button label="Browse" @click="getFolderPath" severity="success" outlined />
  </div>
  <div v-if="componentList.length > 0">
    <h3>Components</h3>
    <DataTable v-model:selection="selectedPage" showGridlines paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"  :value="componentList" dataKey="path">
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="filename" header="File name"></Column>
    </DataTable>
  </div>
  <div v-if="pageList.length > 0">
    <h3>Pages</h3>
    <DataTable v-model:selection="selectedComponent" showGridlines paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"  :value="pageList" dataKey="path">
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="filename" header="File name"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { ref, watch } from 'vue';

const selectedPage = ref<any[]>([]);
const selectedComponent = ref<any[]>([]);
const pageList = ref<any[]>([]);
const componentList = ref<any[]>([]);
const folderPath = ref("")

const emit = defineEmits(['getListEvent']); 

watch([pageList, componentList], (newValue) => {
  emit('getListEvent', {pageList: newValue[0], componentList: newValue[1]});
});

const getFolderPath = async () => {
  await window.electronAPI.ipcRenderer.invoke('select-directory', 'export').then((path: string) => {
    folderPath.value = path
  })
  const result = await window.electronAPI.getFilesFromPagesAndComponents(folderPath.value);
  pageList.value = result.pages;
  componentList.value = result.components;
}

</script>

<style lang="scss" scoped></style>