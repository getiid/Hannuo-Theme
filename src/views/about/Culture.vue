<template>
  <div class="culture-page">
    <div class="culture-content" v-if="cultureData">
      <!-- 企业使命 -->
      <section class="section">
        <h2>企业使命</h2>
        <div class="content" v-html="cultureData.mission"></div>
      </section>

      <!-- 企业愿景 -->
      <section class="section">
        <h2>企业愿景</h2>
        <div class="content" v-html="cultureData.vision"></div>
      </section>

      <!-- 核心价值观 -->
      <section class="section">
        <h2>核心价值观</h2>
        <div class="values-grid">
          <div v-for="(value, index) in cultureData.values" 
               :key="index"
               class="value-item">
            <div class="value-icon">
              <img :src="value.icon" :alt="value.title">
            </div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </section>
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
  name: 'Culture',
  setup() {
    const cultureData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await wpApi.getAboutData()
        cultureData.value = response?.culture
      } catch (err) {
        console.error('获取企业文化数据失败:', err)
        error.value = '加载失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchData)

    return {
      cultureData,
      loading,
      error,
      fetchData
    }
  }
}
</script>

<style scoped>
.culture-page {
  padding: 20px 0;
}

.section {
  margin-bottom: 60px;
}

h2 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.content {
  line-height: 1.8;
  color: #666;
  text-indent: 2em;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.value-item {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.value-item:hover {
  transform: translateY(-5px);
}

.value-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.value-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

h3 {
  color: #333;
  margin-bottom: 15px;
}

p {
  color: #666;
  line-height: 1.6;
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
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style> 