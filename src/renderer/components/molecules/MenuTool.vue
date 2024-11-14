<template>
  <Card class="cursor-pointer p-ripple w-56 outline-green-500 " @click="onClick">
    <template #content>
      <div class="flex items-center h-2 justify-center">
        <div class="flex  items-center w-full">
          <i class="pi pi-check text-green-500 "></i>
          <span class="tool-name cursor-pointer text-green-500 ml-2">{{ name }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import Card from "primevue/card";

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});
const emit = defineEmits(["card-clicked"]);
const { name } = toRefs(props);

function onClick(e: Event) {
  emit("card-clicked", e);
}
</script>

<style lang="scss" scoped>
@use "@assets/scss/_variable";
.p-card {
  box-shadow: none;
  outline: 1px variable.$main-color solid;
  border-radius: 5px;
  font-size: 14px;
  color: variable.$main-color;
}
</style>