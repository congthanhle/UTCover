<template>
  <div class="side-menu">
    <div class="profile flex flex-col items-center">
      <Avatar icon="pi pi-user" class="mr-2" size="xlarge" shape="circle" />
      <span class="mt-1">NAME</span>
    </div>
    <div class="card flex justify-center">
      <Menu :model="items" class="w-full md:w-60">
        <template #submenulabel="{ item }">
          <span class="text-green-500 font-bold">{{ item.label }}</span>
        </template>
        <template #item="{ item, props }">
          <a v-ripple class="flex items-center" v-bind="props.action" @click="goPage(item.link)">
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
    <footer>
      <Button icon="pi pi-sign-out" label="Logout" outlined class="w-full"/>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import { useRouter } from 'vue-router';

const router = useRouter();

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
    label: 'Documents',
    items: [
      {
        label: 'New',
        icon: 'pi pi-plus',
        link: "/item-list",
        shortcut: '⌘+N'
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
        shortcut: '⌘+S'
      }
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        shortcut: '⌘+O'
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
        badge: 2
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        shortcut: '⌘+Q'
      }
    ]
  },
]);

const goPage = (link: string) => {
  router.push(link);
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
}

.profile {
  margin: 20px 10px 40px;
}
</style>
