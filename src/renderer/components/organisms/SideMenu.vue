<template>
<ToggleSwitch v-model="isSidebar"  v-if="!isSidebar"/>
  <div v-if="isSidebar" class="side-menu">
    <div class="profile flex flex-col items-center">
      <ToggleSwitch v-model="isSidebar" />
    </div>
    <div class="card flex justify-center">
      <Menu :model="items" class="w-full md:w-60 menu">
        <template #submenulabel="{ item }">
          <span class="text-green-500 font-bold">{{ item.label }}</span>
        </template>
        <template #item="{ item, props }">
          <a v-ripple class="flex items-center" v-bind="props.action" @click="goPage(item.link)" :class="{ 'active': isActive(item.link) }">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            <span v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut
              }}</span>
          </a>
        </template>
      </Menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isSidebar = ref<boolean>(true);
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    link: "/",
  },
  {
    separator: true
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'Unit Test',
        icon: 'pi pi-verified',
        link: "/item-list",
        shortcut: ''
      },
      {
        label: 'Mock API',
        icon: 'pi pi-play-circle',
      },
      {
        label: 'Data Sample',
        icon: 'pi pi-ticket',
        link: "/data-sample",
      },
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Calendar',
        icon: 'pi pi-calendar',
        link: "/calendar",
        badge: '3'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        shortcut: '⌘+O'
      },
    ]
  },
]);


const goPage = (link: string) => {
  router.push(link);
}

const isActive = (link: string) => {
  return route.path === link;
}
</script>

<style lang="scss">
@use "@assets/scss/variable";

.side-menu {
  display: flex;
  align-items: center;
  flex-direction: column;
  border-right: 1px solid variable.$main-color;
  width: 300px;
  min-width: 300px;
  max-width: 300px;
  max-height: 100vh;
  overflow-y: scroll;
  padding-bottom: 30px;
}

.profile {
  margin: 20px 10px 40px;
}

a.active {
  background-color: rgba(0, 253, 97, 0.103);
}
</style>
