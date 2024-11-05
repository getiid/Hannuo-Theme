<template>
  <div class="research-page">
    <div class="content-grid" v-if="researchData">
      <div v-for="(item, index) in researchData" 
           :key="index" 
           class="grid-item">
        <img :src="item.icon" :alt="item.title">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
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
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.grid-item {
  text-align: center;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
}

.grid-item img {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.grid-item h3 {
  margin-bottom: 15px;
  color: #333;
}

.grid-item p {
  color: #666;
  line-height: 1.6;
}
</style> 