import { createRouter, createWebHashHistory } from 'vue-router';
import Result from '../pages/Result.vue';

const routes = [
  {
    path: '/',
    name: 'Result',
    component: Result
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
