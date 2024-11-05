<template>
  <div class="home">
    <!-- 轮播图部分 -->
    <div class="banner-section">
      <div class="banner-content" v-if="homeData">
        <div v-for="(slide, index) in homeData.banner_slides" :key="index" 
             class="banner-slide" 
             :class="{ active: currentSlide === index }">
          <img :src="slide.image" :alt="slide.title">
          <div class="slide-content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 公司简介部分 -->
    <div class="company-intro" v-if="homeData">
      <div class="container">
        <h2>{{ homeData.company_intro_title }}</h2>
        <div class="intro-content" v-html="homeData.company_intro_content"></div>
      </div>
    </div>

    <!-- 特色产品部分 -->
    <div class="featured-products">
      <div class="container">
        <h2>特色产品</h2>
        <div class="products-grid">
          <div v-for="product in featuredProducts" :key="product.id" class="product-card">
            <img :src="product.featured_image" :alt="product.title">
            <h3>{{ product.title }}</h3>
            <p v-html="product.excerpt"></p>
            <router-link :to="`/products/${product.id}`" class="view-more">
              了解更多
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 新闻动态部分 -->
    <div class="latest-news">
      <div class="container">
        <h2>新闻动态</h2>
        <div class="news-grid">
          <div v-for="post in latestNews" :key="post.id" class="news-card">
            <div class="news-date">{{ formatDate(post.date) }}</div>
            <h3 v-html="post.title.rendered"></h3>
            <div class="news-excerpt" v-html="post.excerpt.rendered"></div>
            <router-link :to="`/news/${post.id}`" class="read-more">
              阅读更多
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import wpApi from '../services/wp-api'

export default {
  name: 'Home',
  setup() {
    const homeData = ref(null)
    const featuredProducts = ref([])
    const latestNews = ref([])
    const currentSlide = ref(0)

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    const fetchHomeData = async () => {
      try {
        const response = await wpApi.getHomeData()
        console.log('Home data:', response)
        homeData.value = response.acf || response
      } catch (error) {
        console.error('获取首页数据失败:', error)
      }
    }

    const fetchFeaturedProducts = async () => {
      try {
        const response = await wpApi.getFeaturedProducts()
        featuredProducts.value = response
      } catch (error) {
        console.error('获取特色产品失败:', error)
      }
    }

    const fetchLatestNews = async () => {
      try {
        const response = await wpApi.getPosts(1, 3) // 获取最新的3条新闻
        latestNews.value = response
      } catch (error) {
        console.error('获取最新新闻失败:', error)
      }
    }

    // 轮播图自动切换
    const startSlideshow = () => {
      setInterval(() => {
        if (homeData.value && homeData.value.banner_slides) {
          currentSlide.value = (currentSlide.value + 1) % homeData.value.banner_slides.length
        }
      }, 5000) // 每5秒切换一次
    }

    onMounted(() => {
      fetchHomeData()
      fetchFeaturedProducts()
      fetchLatestNews()
      startSlideshow()
    })

    return {
      homeData,
      featuredProducts,
      latestNews,
      currentSlide,
      formatDate
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
}

.banner-section {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.banner-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.banner-slide.active {
  opacity: 1;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.company-intro {
  background: #f8f9fa;
  padding: 60px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card h3 {
  padding: 15px;
  margin: 0;
}

.product-card p {
  padding: 0 15px;
  color: #666;
}

.view-more {
  display: inline-block;
  margin: 15px;
  padding: 8px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.news-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.news-date {
  color: #666;
  font-size: 0.9em;
}

.news-card h3 {
  margin: 10px 0;
}

.read-more {
  display: inline-block;
  margin-top: 15px;
  color: #007bff;
  text-decoration: none;
}

@media (max-width: 768px) {
  .banner-section {
    height: 400px;
  }

  .slide-content {
    left: 20px;
    bottom: 20px;
  }
}
</style> 