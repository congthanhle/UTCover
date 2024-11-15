import { createApp } from 'vue'
import './style.scss';
import App from './App.vue';
import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import BlockUI from 'primevue/blockui';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import router from './router';
import ToastService from 'primevue/toastservice';


const app = createApp(App);
app.component('Button', Button);
app.component('Badge', Badge);
app.component('ProgressSpinner', ProgressSpinner);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('BlockUI', BlockUI);
app.component('InputText', InputText);
app.component('Toast', Toast);
app.component('Select', Select);
app.component('DatePicker', DatePicker);
app.component('Tag', Tag);
app.component('Dialog', Dialog);
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
