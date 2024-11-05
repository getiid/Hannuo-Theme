<template>
  <div class="about-page">
    <div class="about-header">
      <h1>关于我们</h1>
      <div class="sub-nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="`/about/${item.path}`"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
    
    <router-view></router-view>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'About',
  setup() {
    const route = useRoute()
    
    const navItems = [
      { name: '企业介绍', path: 'intro' },
      { name: '企业文化', path: 'culture' },
      { name: '发展历程', path: 'history' }
    ]
    
    const isActive = (path) => {
      return route.path === `/about/${path}`
    }
    
    return {
      navItems,
      isActive
    }
  }
}
</script>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.about-header {
  text-align: center;
  margin-bottom: 60px;
}

h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 30px;
}

.sub-nav {
  display: flex;
  justify-content: center;
  gap: 40px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.nav-item {
  font-size: 1.1em;
  color: #666;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #007bff;
}

.nav-item.active {
  color: #007bff;
  background: #f8f9fa;
}
</style> 