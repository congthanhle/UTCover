import { createApp } from 'vue'
import './style.css';
import App from './App.vue'
import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';
import Button from 'primevue/button';


const app = createApp(App);
app.component('Button', Button);

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

app.mount('#app');
