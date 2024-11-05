<template>
  <div class="production-page">
    <div class="production-header">
      <h1>研发生产</h1>
      <div class="sub-nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="`/production/${item.path}`"
          class="nav-item"
          :class="{ active: currentPath === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
    
    <router-view></router-view>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Production',
  setup() {
    const route = useRoute()
    
    const navItems = [
      { name: '研发能力', path: 'research' },
      { name: '生产设备', path: 'equipment' },
      { name: '质量控制', path: 'quality' }
    ]
    
    const currentPath = computed(() => {
      return route.path.split('/').pop()
    })
    
    return {
      navItems,
      currentPath
    }
  }
}
</script>

<style scoped>
.production-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.production-header {
  text-align: center;
  margin-bottom: 40px;
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