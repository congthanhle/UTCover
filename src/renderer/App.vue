<script setup lang="ts">
import { ref } from 'vue';
import ItemList from './components/ItemList.vue';
window.electronAPI.sendMessage('Hello from App.vue!');

const pageList = ref<any[]>([]);
const componentList = ref<any[]>([]);

const handleListFile = (data: {pageList: any[], componentList: any[]}) => {
  pageList.value = data.pageList;
  componentList.value = data.componentList;
  console.log(data);
}

</script>

<template>
  <ItemList style="margin-top: 20px;" @getListEvent="handleListFile"/>
  <div class="button-container">
    <Button v-if="pageList.length > 0 || componentList.length > 0" label="Test Unit" severity="success" raised style="margin-top: 16px;"/>
  </div>
  
</template>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end; 
}
</style>
