<template>
  <div class="news-list">
    <div v-if="loading && !posts.length" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchPosts">重试</button>
    </div>
    
    <template v-else>
      <div v-if="posts.length === 0" class="empty-state">
        暂无新闻
      </div>
      
      <div v-else>
        <div v-for="post in posts" :key="post.id" class="news-item">
          <div class="news-image" v-if="post.featured_image">
            <img :src="post.featured_image" :alt="post.title.rendered">
          </div>
          <div class="news-content">
            <div class="news-date">{{ formatDate(post.date) }}</div>
            <h3 class="news-title" v-html="post.title.rendered"></h3>
            <div class="news-excerpt" v-html="post.excerpt.rendered"></div>
            <div class="news-meta">
              <span class="news-category" v-if="post.categories_info && post.categories_info.length">
                {{ post.categories_info[0].name }}
              </span>
              <router-link :to="`/news/${post.id}`" class="read-more">
                阅读更多
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="pagination" v-if="hasMore">
          <button @click="loadMore" :disabled="loading">
            {{ loading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import wpApi from '../services/wp-api';

export default {
  name: 'NewsList',
  data() {
    return {
      posts: [],
      currentPage: 1,
      loading: false,
      hasMore: true
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    async fetchPosts() {
      this.loading = true;
      try {
        const response = await wpApi.getPosts(this.currentPage);
        if (response.length < 10) {
          this.hasMore = false;
        }
        this.posts = [...this.posts, ...response];
        this.currentPage += 1;
      } catch (error) {
        console.error('加载新闻失败', error);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.fetchPosts();
    }
  },
  mounted() {
    this.fetchPosts();
  }
}
</script>

<style scoped>
.news-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.news-item {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  border-bottom: 1px solid #eee;
  padding: 30px 0;
  margin-bottom: 20px;
}

.news-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-image img:hover {
  transform: scale(1.05);
}

.news-content {
  display: flex;
  flex-direction: column;
}

.news-date {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.news-title {
  margin: 0 0 15px 0;
  font-size: 1.5em;
  color: #333;
}

.news-excerpt {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.news-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-category {
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #666;
}

.read-more {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: #0056b3;
}

.pagination {
  text-align: center;
  margin-top: 40px;
}

button {
  padding: 10px 30px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .news-item {
    grid-template-columns: 1fr;
  }
  
  .news-image {
    height: 200px;
  }
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
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
</style> 