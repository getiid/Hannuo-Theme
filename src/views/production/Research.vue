<template>
  <div class="research-page">
    <div class="content-grid" v-if="researchData">
      <div v-for="(item, index) in researchData" 
           :key="index" 
           class="grid-item">
        <div class="image-container">
          <img :src="item.icon" :alt="item.title">
        </div>
        <div class="content-container">
          <h3>{{ item.title }}</h3>
          <p class="description">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import wpApi from '../../services/wp-api'

export default {
  name: 'Research',
  setup() {
    const researchData = ref(null)
    
    const fetchData = async () => {
      try {
        const response = await wpApi.getProductionData()
        researchData.value = response?.research_capabilities
      } catch (error) {
        console.error('获取研发能力数据失败:', error)
      }
    }
    
    onMounted(fetchData)
    
    return {
      researchData
    }
  }
}
</script>

<style scoped>
.research-page {
  padding: 20px 0;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.grid-item {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.image-container {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.grid-item:hover .image-container img {
  transform: scale(1.05);
}

.content-container {
  padding: 25px;
  text-align: left;
}

h3 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.description {
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-size: 1em;
  text-indent: 2em;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .image-container {
    height: 200px;
  }
}
</style> 