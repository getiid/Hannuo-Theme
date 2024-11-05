<template>
  <div class="home-page">
    <!-- Banner轮播 -->
    <HomeBanner v-if="homeData?.banner?.length" :bannerData="homeData.banner" />
    
    <!-- 特色板块 -->
    <HomeFeatures v-if="homeData?.features?.length" :features="homeData.features" />
    
    <!-- 关于我们引用 -->
    <HomeAbout v-if="homeData?.about" :aboutData="homeData.about" />
    
    <!-- 产品分类 -->
    <HomeProducts v-if="homeData?.product_categories" :productData="homeData.product_categories" />
    
    <!-- 新闻动态 -->
    <div class="home-news">
      <div class="section-header">
        <h2>新闻动态</h2>
        <div class="divider"></div>
      </div>
      <div class="news-grid" v-if="homeData?.latest_news?.length">
        <div v-for="news in homeData.latest_news" 
             :key="news.id" 
             class="news-item"
             @click="goToNews(news.id)">
          <div class="news-image" v-if="news.featured_image">
            <img :src="news.featured_image" :alt="news.title.rendered">
          </div>
          <div class="news-content">
            <div class="news-date">{{ formatDate(news.date) }}</div>
            <h3 class="news-title" v-html="news.title.rendered"></h3>
            <div class="news-excerpt" v-html="news.excerpt.rendered"></div>
          </div>
        </div>
      </div>
      <div class="view-more">
        <router-link to="/news" class="view-more-link">
          查看更多新闻
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeBanner from '../components/HomeBanner.vue'
import HomeFeatures from '../components/HomeFeatures.vue'
import HomeAbout from '../components/HomeAbout.vue'
import HomeProducts from '../components/HomeProducts.vue'
import wpApi from '../services/wp-api'

export default {
  name: 'Home',
  components: {
    HomeBanner,
    HomeFeatures,
    HomeAbout,
    HomeProducts
  },
  setup() {
    const router = useRouter()
    const homeData = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    const goToNews = (id) => {
      router.push(`/news/${id}`)
    }

    const fetchHomeData = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await wpApi.getHomeData()
        console.log('Home page data:', response)
        homeData.value = response
      } catch (err) {
        console.error('获取首页数据失败:', err)
        error.value = '加载失败'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchHomeData)

    return {
      homeData,
      loading,
      error,
      formatDate,
      goToNews
    }
  }
}
</script>

<style scoped>
.home-page {
  /* 每个组件都有自己的内边距，这里不需要额外的样式 */
}

.home-news {
  padding: 80px 0;
  background: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
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
  cursor: pointer;
  transition: transform 0.3s ease;
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
}

.news-excerpt {
  color: #666;
  font-size: 0.9em;
  line-height: 1.6;
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