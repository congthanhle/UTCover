// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import ItemList from '@pages/UnitTest/ItemList.vue';
import Result from '@pages/UnitTest/Result.vue';
import Dashboard from '@pages/Dashboard.vue';
import BaseLayout from '@layouts/BaseLayout.vue';

const routes = [
  {
    path: '/',
    component: BaseLayout, // Use BaseLayout as the layout
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: '/item-list',
        name: 'ItemList',
        component: ItemList,
      },
      {
        path: '/result',
        name: 'Result',
        component: Result,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
