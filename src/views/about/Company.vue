<template>
  <div class="company-page">
    <div class="company-content" v-if="companyData">
      <!-- 公司简介 -->
      <section class="section">
        <h2>公司简介</h2>
        <div class="content" v-html="companyData.introduction"></div>
      </section>

      <!-- 企业优势 -->
      <section class="section">
        <h2>企业优势</h2>
        <div class="advantages-grid">
          <div v-for="(advantage, index) in companyData.advantages" 
               :key="index"
               class="advantage-item">
            <img :src="advantage.icon" :alt="advantage.title">
            <h3>{{ advantage.title }}</h3>
            <p>{{ advantage.description }}</p>
          </div>
        </div>
      </section>

      <!-- 荣誉资质 -->
      <section class="section">
        <h2>荣誉资质</h2>
        <div class="certificates-grid">
          <div v-for="(cert, index) in companyData.certificates" 
               :key="index"
               class="certificate-item">
            <img :src="cert.image" :alt="cert.title">
            <p>{{ cert.title }}</p>
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
  name: 'Company',
  setup() {
    const companyData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await wpApi.getAboutData()
        companyData.value = response?.company
      } catch (err) {
        console.error('获取公司介绍数据失败:', err)
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
.company-page {
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

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.advantage-item {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.advantage-item:hover {
  transform: translateY(-5px);
}

.advantage-item img {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.advantage-item h3 {
  color: #333;
  margin-bottom: 15px;
}

.advantage-item p {
  color: #666;
  line-height: 1.6;
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.certificate-item {
  text-align: center;
}

.certificate-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.certificate-item:hover img {
  transform: scale(1.05);
}

.certificate-item p {
  color: #666;
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
  .advantages-grid {
    grid-template-columns: 1fr;
  }
}
</style> 