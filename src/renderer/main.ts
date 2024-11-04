import { createApp } from 'vue'
import './style.css';
import App from './App.vue';
import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';
import Button from 'primevue/button';
import router from './router';
import ToastService from 'primevue/toastservice';


const app = createApp(App);
app.component('Button', Button);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
      preset: Aura,
      options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
      }
  }
});

app.use(router);
app.mount('#app');
