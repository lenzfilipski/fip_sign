import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '@/router';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
/* import specific icons */
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
/* add icons to the library */
library.add(faFileImport);

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app');
