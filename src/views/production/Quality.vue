<template>
  <div class="quality-page">
    <div class="quality-content" v-if="qualityData">
      <div class="quality-text" v-html="qualityData.content"></div>
      <div class="quality-images" v-if="qualityData.images">
        <div v-for="(image, index) in qualityData.images" 
             :key="index" 
             class="quality-image">
          <img :src="image.url" :alt="image.title">
          <p>{{ image.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import wpApi from '../../services/wp-api'

export default {
  name: 'Quality',
  setup() {
    const qualityData = ref(null)
    
    const fetchData = async () => {
      try {
        const response = await wpApi.getProductionData()
        qualityData.value = response?.quality_control
      } catch (error) {
        console.error('获取质量控制数据失败:', error)
      }
    }
    
    onMounted(fetchData)
    
    return {
      qualityData
    }
  }
}
</script>

<style scoped>
.quality-content {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 8px;
}

.quality-text {
  margin-bottom: 30px;
  line-height: 1.8;
  color: #333;
}

.quality-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.quality-image {
  text-align: center;
}

.quality-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 10px;
}

.quality-image p {
  color: #666;
}
</style> 