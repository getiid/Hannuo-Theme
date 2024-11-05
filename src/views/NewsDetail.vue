<template>
  <div class="news-detail" v-if="news">
    <div class="news-header">
      <div class="news-meta">
        <span class="news-date">{{ formatDate(news.date) }}</span>
        <span class="news-category" v-if="news.categories_info && news.categories_info.length">
          {{ news.categories_info[0].name }}
        </span>
      </div>
      <h1 v-html="news.title.rendered"></h1>
    </div>
    
    <div class="news-content">
      <div class="featured-image" v-if="news.featured_image">
        <img :src="news.featured_image" :alt="news.title.rendered">
      </div>
      
      <div class="content" v-html="news.content.rendered"></div>
    </div>

    <div class="news-footer">
      <router-link to="/news" class="back-link">
        返回新闻列表
      </router-link>
    </div>
  </div>

  <div v-else-if="loading" class="loading-state">
    <div class="loading-spinner"></div>
    <p>加载中...</p>
  </div>

  <div v-else-if="error" class="error-state">
    <p>{{ error }}</p>
    <button @click="fetchNews">重试</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import wpApi from '../services/wp-api'

export default {
  name: 'NewsDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const news = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    const fetchNews = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await wpApi.getPost(route.params.id)
        news.value = response
      } catch (err) {
        console.error('获取新闻详情失败:', err)
        error.value = '加载新闻详情失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchNews)

    return {
      news,
      loading,
      error,
      formatDate,
      fetchNews
    }
  }
}
</script>

<style scoped>
.news-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.news-header {
  text-align: center;
  margin-bottom: 40px;
}

.news-meta {
  margin-bottom: 20px;
  color: #666;
}

.news-date {
  margin-right: 20px;
}

.news-category {
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.9em;
}

h1 {
  font-size: 2em;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.news-content {
  margin-bottom: 40px;
}

.featured-image {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: auto;
  display: block;
}

.content {
  line-height: 1.8;
  color: #333;
}

.content :deep(p) {
  margin-bottom: 1.5em;
  text-indent: 2em;
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
  border-radius: 4px;
}

.news-footer {
  text-align: center;
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.back-link {
  display: inline-block;
  padding: 10px 25px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.back-link:hover {
  background: #0056b3;
}

.loading-state, .error-state {
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

.error-state button:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .news-detail {
    padding: 20px;
  }
  
  h1 {
    font-size: 1.5em;
  }
}
</style> 