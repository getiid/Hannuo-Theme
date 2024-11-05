<template>
  <div class="history-page">
    <div v-if="historyData" class="history-content">
      <div class="timeline">
        <div v-for="(item, index) in historyData" 
             :key="index"
             class="timeline-item"
             :class="{ 'right-aligned': index % 2 === 1 }">
          <div class="year">{{ item.year }}</div>
          <div class="events">
            <div v-for="(event, eventIndex) in item.events" 
                 :key="eventIndex"
                 class="event">
              {{ event.description }}
            </div>
          </div>
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
  name: 'CompanyHistory',
  setup() {
    const historyData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await wpApi.getAboutData()
        historyData.value = response?.history
      } catch (err) {
        console.error('获取发展历程数据失败:', err)
        error.value = '加载失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchData)

    return {
      historyData,
      loading,
      error,
      fetchData
    }
  }
}
</script>

<style scoped>
.history-page {
  padding: 20px 0;
}

.history-content {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  padding: 40px 0;
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: #eee;
}

.timeline-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 60px;
  position: relative;
  width: 50%;
  padding-right: 50px;
}

.timeline-item.right-aligned {
  margin-left: auto;
  padding-right: 0;
  padding-left: 50px;
}

.year {
  background: #007bff;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  position: absolute;
  right: -85px;
  top: 0;
  z-index: 1;
}

.timeline-item.right-aligned .year {
  right: auto;
  left: -85px;
}

.events {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.events::before {
  content: '';
  position: absolute;
  right: -15px;
  top: 15px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 0 10px 15px;
  border-color: transparent transparent transparent #f8f9fa;
}

.timeline-item.right-aligned .events::before {
  right: auto;
  left: -15px;
  border-width: 10px 15px 10px 0;
  border-color: transparent #f8f9fa transparent transparent;
}

.event {
  margin-bottom: 10px;
  color: #666;
  line-height: 1.6;
}

.event:last-child {
  margin-bottom: 0;
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
  .timeline::before {
    left: 30px;
  }
  
  .timeline-item,
  .timeline-item.right-aligned {
    width: 100%;
    padding-left: 80px;
    padding-right: 0;
  }
  
  .year,
  .timeline-item.right-aligned .year {
    left: 0;
    right: auto;
  }
  
  .events::before,
  .timeline-item.right-aligned .events::before {
    left: -15px;
    right: auto;
    border-width: 10px 15px 10px 0;
    border-color: transparent #f8f9fa transparent transparent;
  }
}
</style> 