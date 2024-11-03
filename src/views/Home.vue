<template>
  <div class="home">
    <!-- Banner部分 -->
    <div class="banner">
      <div class="banner-content">
        <h1>{{ bannerInfo.title }}</h1>
        <p>{{ bannerInfo.description }}</p>
      </div>
    </div>

    <!-- 产品展示部分 -->
    <section class="products-section">
      <h2>产品展示</h2>
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.featured_media_url" :alt="product.title.rendered">
          </div>
          <div class="product-info">
            <h3 v-html="product.title.rendered"></h3>
            <div class="excerpt" v-html="product.excerpt.rendered"></div>
            <router-link :to="`/products/${product.id}`" class="read-more">
              了解更多
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 公司简介部分 -->
    <section class="about-section">
      <div class="about-content">
        <h2>关于我们</h2>
        <div v-html="aboutContent"></div>
        <router-link to="/about" class="read-more">
          查看详情
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPages, getProducts } from '../api/wordpress'

const bannerInfo = ref({
  title: '汉诺化工',
  description: '专业的化工产品供应商'
})

const products = ref([])
const aboutContent = ref('')

onMounted(async () => {
  try {
    // 获取首页数据
    const [pagesRes, productsRes] = await Promise.all([
      getPages(),
      getProducts()
    ])

    // 处理首页内容
    const homepage = pagesRes.data.find(page => page.slug === 'home')
    if (homepage) {
      bannerInfo.value = {
        title: homepage.title.rendered,
        description: homepage.excerpt.rendered.replace(/<[^>]*>/g, '')
      }
      aboutContent.value = homepage.content.rendered
    }

    // 处理产品列表
    products.value = productsRes.data.slice(0, 6) // 只显示前6个产品
  } catch (error) {
    console.error('Failed to fetch home data:', error)
  }
})
</script>

<style lang="scss" scoped>
.home {
  .banner {
    height: 600px;
    background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
                url('@/assets/images/banner.jpg') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;

    .banner-content {
      max-width: 800px;
      padding: 0 2rem;

      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.2rem;
        line-height: 1.6;
      }
    }
  }

  section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;

    h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    .product-card {
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }

      .product-image {
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .product-info {
        padding: 1.5rem;

        h3 {
          margin: 0 0 1rem;
          font-size: 1.2rem;
          color: #333;
        }

        .excerpt {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.6;
        }
      }
    }
  }

  .about-section {
    background: #f8f8f8;

    .about-content {
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.8;
      color: #666;
    }
  }

  .read-more {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background: #1890ff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.3s;

    &:hover {
      background: #40a9ff;
    }
  }
}
</style> 