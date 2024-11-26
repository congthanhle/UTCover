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
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Textarea from 'primevue/textarea';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import InputNumber from 'primevue/inputnumber';
import { Codemirror } from 'vue-codemirror'
import Skeleton from 'primevue/skeleton';
import Checkbox from 'primevue/checkbox';
import ToggleSwitch from 'primevue/toggleswitch';
import router from './router';
import ToastService from 'primevue/toastservice';


const app = createApp(App);
const components = {
  Button,
  Badge,
  ProgressSpinner,
  DataTable,
  Column,
  BlockUI,
  InputText,
  Toast,
  Select,
  DatePicker,
  Tag,
  Dialog,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Textarea,
  Splitter,
  SplitterPanel,
  InputNumber,
  Codemirror,
  Skeleton,
  Checkbox,
  ToggleSwitch
};

Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});
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
