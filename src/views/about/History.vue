<template>
  <div class="history-page">
    <div class="history-content" v-if="historyData">
      <div class="timeline">
        <div v-for="(item, index) in historyData" 
             :key="index"
             class="timeline-item">
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
  name: 'History',
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

.timeline {
  position: relative;
  padding: 40px 0;
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
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 60px;
  position: relative;
}

.year {
  background: #007bff;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  position: relative;
  z-index: 1;
}

.events {
  position: absolute;
  left: calc(50% + 40px);
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  width: calc(50% - 60px);
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
    left: 20px;
  }
  
  .timeline-item {
    justify-content: flex-start;
    padding-left: 40px;
  }
  
  .events {
    position: relative;
    left: 20px;
    width: calc(100% - 60px);
  }
}
</style> 