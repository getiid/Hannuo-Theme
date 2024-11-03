<template>
  <div class="news">
    <h1>新闻动态</h1>
    
    <!-- 新闻列表 -->
    <div class="news-list">
      <article v-for="news in newsList" :key="news.id" class="news-item">
        <div class="news-image" v-if="news.featured_media_url">
          <img :src="news.featured_media_url" :alt="news.title.rendered">
        </div>
        <div class="news-content">
          <h2 v-html="news.title.rendered"></h2>
          <div class="meta">
            <span class="date">{{ formatDate(news.date) }}</span>
            <span class="category" v-if="news.category_name">
              {{ news.category_name }}
            </span>
          </div>
          <div class="excerpt" v-html="news.excerpt.rendered"></div>
          <button class="read-more" @click="showNewsDetail(news)">
            阅读更多
          </button>
        </div>
      </article>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        上一页
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        下一页
      </button>
    </div>

    <!-- 新闻详情弹窗 -->
    <div v-if="selectedNews" class="news-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">&times;</button>
        <h2 v-html="selectedNews.title.rendered"></h2>
        <div class="meta">
          <span class="date">{{ formatDate(selectedNews.date) }}</span>
          <span class="category" v-if="selectedNews.category_name">
            {{ selectedNews.category_name }}
          </span>
        </div>
        <div class="modal-body" v-html="selectedNews.content.rendered"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPosts } from '../api/wordpress'

const newsList = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const selectedNews = ref(null)
const perPage = 10

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchNews = async (page = 1) => {
  try {
    const response = await getPosts({
      page,
      per_page: perPage
    })
    newsList.value = response.data
    totalPages.value = parseInt(response.headers['x-wp-totalpages']) || 1
  } catch (error) {
    console.error('Failed to fetch news:', error)
  }
}

const changePage = (page) => {
  currentPage.value = page
  fetchNews(page)
  window.scrollTo(0, 0)
}

const showNewsDetail = (news) => {
  selectedNews.value = news
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedNews.value = null
  document.body.style.overflow = 'auto'
}

onMounted(() => {
  fetchNews()
})
</script>

<style lang="scss" scoped>
.news {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 3rem;
    text-align: center;
  }

  .news-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .news-item {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    &:hover {
      transform: translateY(-5px);
    }

    .news-image {
      height: 200px;
      overflow: hidden;
      border-radius: 4px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .news-content {
      h2 {
        font-size: 1.5rem;
        margin: 0 0 1rem;
        color: #333;
      }

      .meta {
        display: flex;
        gap: 1rem;
        color: #666;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .excerpt {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .read-more {
        padding: 0.5rem 1.5rem;
        background: #1890ff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: #40a9ff;
        }
      }
    }
  }

  .pagination {
    margin-top: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover:not(:disabled) {
        border-color: #1890ff;
        color: #1890ff;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .page-info {
      color: #666;
    }
  }

  .news-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      max-width: 800px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;

      .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;

        &:hover {
          color: #333;
        }
      }

      h2 {
        margin-bottom: 1rem;
        color: #333;
      }

      .meta {
        margin-bottom: 2rem;
        color: #666;
      }

      .modal-body {
        line-height: 1.8;
        color: #666;

        img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
      }
    }
  }
}
</style> 