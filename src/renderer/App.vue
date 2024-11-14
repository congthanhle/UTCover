<script setup lang="ts">
    window.electronAPI.sendMessage('Hello from App.vue!');
</script>

<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style scoped></style>
