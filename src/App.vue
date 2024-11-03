<template>
  <div class="app">
    <Header />
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Footer />
    <BackToTop />
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import BackToTop from './components/common/BackToTop.vue'
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding-top: 72px; /* Header 的高度 */
  flex: 1;
}
</style> 