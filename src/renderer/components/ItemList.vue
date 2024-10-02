<template>
  <div class="folder-path-input">
    <InputText type="text" v-model="folderPath" readonly="true" style="min-width: 60%;" />
    <Button label="Browse" @click="getFolderPath" severity="success" />
  </div>
  <h3>Components</h3>
  <DataTable v-model:selection="selectedPage" :value="props.componentList" dataKey="id">
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column field="filename" header="File name"></Column>
  </DataTable>
  <h3>Pages</h3>
  <DataTable v-model:selection="selectedComponent" :value="props.pageList" dataKey="id">
    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column field="filename" header="File name"></Column>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { ref } from 'vue';

const props = defineProps(['componentList', 'pageList'])

const selectedPage = ref<any[]>([]);
const selectedComponent = ref<any[]>([]);
const folderPath = ref("")

const getFolderPath = () => {
  window.electronAPI.ipcRenderer.invoke('select-directory', 'export').then((path: string) => {
    folderPath.value = path
  })
}

interface FileItem {
  filename: string;
  path: string;
}

// const getFilesRecursively = (dir: any, fileList: FileItem[] = []) => {
//   const files = fs.readdirSync(dir);

//   files.forEach((file: any) => {
//     const filePath = path.join(dir, file);
//     const stat = fs.statSync(filePath);

//     if (stat.isDirectory()) {
//       getFilesRecursively(filePath, fileList);
//     } else {
//       fileList.push({ filename: file, path: filePath });
//     }
//   });

//   return fileList;
// }
// const getFilesFromPagesAndComponents = (rootPath: string) => {
//   const result: { pages: FileItem[], components: FileItem[] } = {
//     pages: [],
//     components: [],
//   };

//   const pagesDir = path.join(rootPath, 'pages');
//   if (fs.existsSync(pagesDir)) {
//     result.pages = getFilesRecursively(pagesDir);
//   }

//   const componentsDir = path.join(rootPath, 'components');
//   if (fs.existsSync(componentsDir)) {
//     result.components = getFilesRecursively(componentsDir);
//   }

//   return result;
// }

</script>

<style lang="scss" scoped></style>