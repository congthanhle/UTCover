// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import ItemList from '@pages/UnitTest/ItemList.vue';
import Result from '@pages/UnitTest/Result.vue';
import Dashboard from '@pages/Dashboard.vue';
import BaseLayout from '@layouts/BaseLayout.vue';
import Calendar from '@pages/Calendar.vue';
import DataSample from '@pages/DataSample/DataSample.vue';

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
      {
        path: '/calendar',
        name: 'Calendar',
        component: Calendar,
      },
      {
        path: '/data-sample',
        name: 'DataSample',
        component: DataSample,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
