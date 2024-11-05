<template>
  <div class="news-detail" v-if="news">
    <div class="news-header">
      <h1 v-html="news.title.rendered"></h1>
      <div class="news-meta">
        <span class="news-date">{{ formatDate(news.date) }}</span>
        <span class="news-category" v-if="news.categories_info && news.categories_info.length">
          {{ news.categories_info[0].name }}
        </span>
      </div>
    </div>
    
    <div class="news-content">
      <div class="featured-image" v-if="news.featured_image">
        <img :src="news.featured_image" :alt="news.title.rendered">
      </div>
      
      <div class="content" v-html="news.content.rendered"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import wpApi from '../services/wp-api'

export default {
  name: 'NewsDetail',
  setup() {
    const route = useRoute()
    const news = ref(null)

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    const fetchNews = async () => {
      try {
        const response = await wpApi.getPost(route.params.id)
        news.value = response
      } catch (error) {
        console.error('获取新闻详情失败:', error)
      }
    }

    onMounted(() => {
      fetchNews()
    })

    return {
      news,
      formatDate
    }
  }
}
</script>

<style scoped>
.news-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.news-header {
  text-align: center;
  margin-bottom: 40px;
}

.news-meta {
  color: #666;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.news-category {
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.featured-image {
  margin-bottom: 30px;
}

.featured-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.content {
  line-height: 1.8;
}

@media (max-width: 768px) {
  .news-detail {
    padding: 20px;
  }
}
</style> 