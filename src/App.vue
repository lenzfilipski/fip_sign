<script setup lang="ts">
import TheNavigation from '@/components/TheNavigation.vue';
import router from '@/router';

// Transition animation between routes
router.afterEach((to, from) => {
  var transition = '';
  if ((from.path == '/' && to.path == '/step-two')
      || (from.path == '/step-two' && to.path == '/step-three')
      || (from.path == '/' && to.path == '/step-three')) transition = 'slide-left';
  else transition = 'slide-right';

  to.meta.transition = transition;
})
</script>

<template>
  <TheNavigation />
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition" mode="out-in">
    <component :is="Component" />
  </transition>
  </router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.15s ease-in-out;
}
.slide-left-enter-from {
    opacity: 0;
    transform: translateX(51vw);
}
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-51vw);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.15s ease-in-out;
}
.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-51vw);
}
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(51vw);
}
</style>
