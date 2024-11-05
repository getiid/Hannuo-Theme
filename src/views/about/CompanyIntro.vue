<template>
  <div class="company-intro">
    <div v-if="companyData" class="content">
      <div class="description-section">
        <div class="text-content" v-html="companyData.description"></div>
        <div class="license-image">
          <img :src="companyData.business_license" alt="营业执照">
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchData">重试</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import wpApi from '../../services/wp-api'

export default {
  name: 'CompanyIntro',
  setup() {
    const companyData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await wpApi.getAboutData()
        companyData.value = response?.company_intro
      } catch (err) {
        console.error('获取公司介绍失败:', err)
        error.value = '加载失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchData)

    return {
      companyData,
      loading,
      error,
      fetchData
    }
  }
}
</script>

<style scoped>
.company-intro {
  padding: 20px 0;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
}

.description-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  align-items: start;
}

.text-content {
  line-height: 1.8;
  color: #333;
}

.text-content :deep(p) {
  margin-bottom: 1.5em;
  text-indent: 2em;
}

.license-image {
  position: sticky;
  top: 20px;
}

.license-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.license-image img:hover {
  transform: scale(1.05);
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state button {
  margin-top: 20px;
  padding: 8px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .description-section {
    grid-template-columns: 1fr;
  }
  
  .license-image {
    position: static;
  }
}
</style> 