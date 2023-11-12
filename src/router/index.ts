
import {createRouter, createWebHistory} from 'vue-router';
import 'vue-router';

// Route views
import StepOne from '@/views/StepOne.vue'
import StepTwo from '@/views/StepTwo.vue'
import StepThree from '@/views/StepThree.vue'

// Map routes
const routes = [
    { path: '/', component: StepOne },
    { path: '/step-one', redirect: '/' },
    { path: '/step-two', component: StepTwo },
    { path: '/step-three', component: StepThree }
]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
});

declare module 'vue-router' {
    interface RouteMeta {
      // is optional
      transition?: string
    }
  }

export default router
