<template>
  <div class="culture-page">
    <div v-if="cultureData" class="culture-content">
      <!-- 企业使命 -->
      <section class="mission-section">
        <h2>企业使命</h2>
        <div class="mission-content">
          <div class="mission-text">{{ cultureData.mission }}</div>
        </div>
      </section>

      <!-- 企业愿景 -->
      <section class="vision-section">
        <h2>企业愿景</h2>
        <div class="vision-content">
          <div class="vision-text">{{ cultureData.vision }}</div>
        </div>
      </section>

      <!-- 核心价值观 -->
      <section class="values-section" v-if="cultureData.core_values?.length">
        <h2>核心价值观</h2>
        <div class="values-grid">
          <div v-for="(value, index) in cultureData.core_values" 
               :key="index"
               class="value-item"
               :class="`value-${index + 1}`">
            <div class="value-content">
              <h3>{{ value.title }}</h3>
              <p>{{ value.description }}</p>
            </div>
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
  name: 'CompanyCulture',
  setup() {
    const cultureData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await wpApi.getAboutData()
        cultureData.value = response?.company_culture
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

.culture-content {
  max-width: 1000px;
  margin: 0 auto;
}

section {
  margin-bottom: 60px;
  text-align: center;
}

h2 {
  font-size: 2em;
  color: #333;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #007bff;
}

.mission-content,
.vision-content {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 8px;
  margin: 0 auto;
  max-width: 800px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.mission-text,
.vision-text {
  font-size: 1.2em;
  line-height: 1.8;
  color: #666;
  text-align: center;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.value-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.value-item:hover {
  transform: translateY(-5px);
}

.value-content {
  padding: 30px;
  text-align: center;
}

.value-content h3 {
  color: #007bff;
  font-size: 1.4em;
  margin-bottom: 15px;
}

.value-content p {
  color: #666;
  line-height: 1.6;
}

/* 为每个价值观添加不同的强调色 */
.value-1 h3 { color: #007bff; }
.value-2 h3 { color: #28a745; }
.value-3 h3 { color: #fd7e14; }
.value-4 h3 { color: #6f42c1; }

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
  
  .mission-content,
  .vision-content {
    padding: 30px 20px;
  }
}
</style> 