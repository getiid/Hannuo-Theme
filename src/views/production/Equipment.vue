<template>
  <div class="equipment-page">
    <div class="equipment-list" v-if="equipmentData">
      <div v-for="(item, index) in equipmentData" 
           :key="index" 
           class="equipment-item">
        <div class="equipment-image">
          <img :src="item.image" :alt="item.name">
        </div>
        <div class="equipment-info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <ul v-if="item.specifications">
            <li v-for="(spec, i) in item.specifications" 
                :key="i">{{ spec }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import wpApi from '../../services/wp-api'

export default {
  name: 'Equipment',
  setup() {
    const equipmentData = ref(null)
    
    const fetchData = async () => {
      try {
        const response = await wpApi.getProductionData()
        equipmentData.value = response?.equipment
      } catch (error) {
        console.error('获取生产设备数据失败:', error)
      }
    }
    
    onMounted(fetchData)
    
    return {
      equipmentData
    }
  }
}
</script>

<style scoped>
.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.equipment-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
}

.equipment-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.equipment-info h3 {
  margin-bottom: 15px;
  color: #333;
}

.equipment-info p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.equipment-info ul {
  margin-top: 15px;
  padding-left: 20px;
}

.equipment-info li {
  margin-bottom: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .equipment-item {
    grid-template-columns: 1fr;
  }
}
</style> 