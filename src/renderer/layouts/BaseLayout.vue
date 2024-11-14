<template>
  <div class="base-layout">
    <SideMenu />
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import SideMenu from '@components/organisms/SideMenu.vue';


</script>

<style scoped>
.base-layout {
  display: flex;
  min-height: 100vh;
}

main {
  width: 100%;
  margin: 20px;
}
</style>
