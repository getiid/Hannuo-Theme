<template>
  <div class="home-news">
    <div class="section-header">
      <h2>新闻动态</h2>
      <div class="divider"></div>
    </div>
    
    <div class="news-grid" v-if="news.length">
      <div v-for="item in news" 
           :key="item.id" 
           class="news-item"
           @click="goToDetail(item.id)">
        <div class="news-image" v-if="item.featured_image">
          <img :src="item.featured_image" :alt="item.title.rendered">
        </div>
        <div class="news-content">
          <div class="news-date">{{ formatDate(item.date) }}</div>
          <h3 class="news-title" v-html="item.title.rendered"></h3>
          <div class="news-excerpt" v-html="item.excerpt.rendered"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
    </div>
    
    <div v-else class="empty-state">
      暂无新闻
    </div>
    
    <div class="view-more">
      <router-link to="/news" class="view-more-link">
        查看更多新闻
        <i class="fas fa-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import wpApi from '../services/wp-api'

export default {
  name: 'HomeNews',
  setup() {
    const router = useRouter()
    const news = ref([])
    const loading = ref(true)
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
    
    const fetchNews = async () => {
      try {
        loading.value = true
        const response = await wpApi.getPosts(1, 3) // 只获取3条最新新闻
        news.value = response
      } catch (err) {
        console.error('获取新闻列表失败:', err)
      } finally {
        loading.value = false
      }
    }
    
    const goToDetail = (id) => {
      router.push(`/news/${id}`)
    }
    
    onMounted(fetchNews)
    
    return {
      news,
      loading,
      formatDate,
      goToDetail
    }
  }
}
</script>

<style scoped>
.home-news {
  padding: 80px 0;
  background: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

h2 {
  font-size: 2.2em;
  color: #333;
  margin-bottom: 15px;
}

.divider {
  width: 60px;
  height: 3px;
  background: #007bff;
  margin: 0 auto;
}

.news-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 0 20px;
}

.news-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.news-item:hover {
  transform: translateY(-5px);
}

.news-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-item:hover .news-image img {
  transform: scale(1.05);
}

.news-content {
  padding: 20px;
}

.news-date {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.news-title {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-excerpt {
  color: #666;
  font-size: 0.9em;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.view-more {
  text-align: center;
  margin-top: 40px;
}

.view-more-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: gap 0.3s ease;
}

.view-more-link:hover {
  gap: 15px;
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style> 