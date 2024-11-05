<template>
  <div class="home-about">
    <div class="about-content">
      <div class="section-header">
        <h2>关于我们</h2>
        <div class="divider"></div>
      </div>
      
      <div class="about-text" v-if="aboutData">
        <div class="description" v-html="aboutData.description"></div>
        <router-link to="/about/intro" class="read-more">
          了解更多
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
      
      <div v-else-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import wpApi from '../services/wp-api'

export default {
  name: 'HomeAbout',
  setup() {
    const aboutData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchAboutData = async () => {
      try {
        loading.value = true
        const response = await wpApi.getAboutData()
        aboutData.value = response?.company_intro
      } catch (err) {
        console.error('获取关于我们数据失败:', err)
        error.value = '加载失败'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchAboutData)

    return {
      aboutData,
      loading,
      error
    }
  }
}
</script>

<style scoped>
.home-about {
  padding: 80px 0;
  background: #f8f9fa;
}

.about-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

h2 {
  font-size: 2.2em;
  color: #333;
  margin-bottom: 15px;
}

.divider {
  width: 60px;
  height: 3px;
  background: #007bff;
  margin: 0 auto;
}

.about-text {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.description {
  font-size: 1.1em;
  line-height: 1.8;
  color: #666;
  margin-bottom: 30px;
}

.description :deep(p) {
  margin-bottom: 1em;
  text-indent: 2em;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.read-more:hover {
  color: #0056b3;
  gap: 15px;
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  color: #dc3545;
  padding: 40px;
}
</style> 