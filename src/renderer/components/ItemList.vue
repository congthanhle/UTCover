<template>
  <TreeTable :value="props.itemList" tableStyle="min-width: 50rem">
    <Column field="name" header="Name" expander style="width: 34%"></Column>
    <Column field="size" header="Size" style="width: 33%"></Column>
    <Column field="type" header="Type" style="width: 33%"></Column>
  </TreeTable>
</template>

<script setup lang="ts">
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { ref } from 'vue';

const props = defineProps(['itemList'])

</script>

<style lang="scss" scoped></style>