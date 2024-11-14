<template>
  <div>
    <MenuTool name="Home" @card-clicked="goHome"/>
  </div>
</template>

<script setup lang="ts">
import MenuTool from '@components/molecules/MenuTool.vue';

import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
}

</script>

<style scoped></style>