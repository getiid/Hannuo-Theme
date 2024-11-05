<template>
  <div class="product-detail" v-if="product">
    <div class="product-header">
      <h1 v-html="product.title.rendered"></h1>
      <div class="product-category" v-if="product.categories">
        <span v-for="category in product.categories" :key="category.id">
          {{ category.name }}
        </span>
      </div>
    </div>
    
    <div class="product-content">
      <!-- 左侧产品图片 -->
      <div class="product-images">
        <div class="main-image">
          <img :src="currentImage" :alt="product.title.rendered">
        </div>
        <div class="image-thumbnails" v-if="product.acf.product_images?.length > 1">
          <div v-for="(image, index) in product.acf.product_images" 
               :key="index"
               class="thumbnail"
               :class="{ active: currentImage === image }"
               @click="currentImage = image">
            <img :src="image" :alt="product.title.rendered">
          </div>
        </div>
      </div>
      
      <!-- 右侧产品信息 -->
      <div class="product-info">
        <div class="info-section">
          <h2>产品信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>CAS号：</label>
              <span>{{ product.acf.cas }}</span>
            </div>
            <div class="info-item">
              <label>分子式：</label>
              <span>{{ product.acf.molecular_formula }}</span>
            </div>
            <div class="info-item">
              <label>分子量：</label>
              <span>{{ product.acf.molecular_weight }}</span>
            </div>
            <div class="info-item">
              <label>纯度：</label>
              <span>{{ product.acf.purity }}</span>
            </div>
            <div class="info-item">
              <label>包装：</label>
              <span>{{ product.acf.packaging }}</span>
            </div>
          </div>
        </div>
        
        <div class="specifications" v-if="product.acf.specifications?.length">
          <h2>规格参数</h2>
          <ul>
            <li v-for="(spec, index) in product.acf.specifications" 
                :key="index">
              {{ spec.value }}
            </li>
          </ul>
        </div>
        
        <div class="product-description" v-if="product.content.rendered">
          <h2>产品描述</h2>
          <div v-html="product.content.rendered"></div>
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
    <button @click="fetchProduct">重试</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import wpApi from '../services/wp-api'

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const product = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const currentImage = ref(null)

    const fetchProduct = async () => {
      try {
        loading.value = true
        error.value = null
        const response = await wpApi.getProduct(route.params.id)
        product.value = response
        // 设置默认显示的图片
        if (response.acf.product_images?.length) {
          currentImage.value = response.acf.product_images[0]
        }
      } catch (err) {
        console.error('获取产品详情失败:', err)
        error.value = '加载产品信息失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchProduct)

    return {
      product,
      loading,
      error,
      currentImage,
      fetchProduct
    }
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.product-header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.product-category span {
  display: inline-block;
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  margin: 0 5px;
  color: #666;
  font-size: 0.9em;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-images {
  position: sticky;
  top: 20px;
}

.main-image {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.main-image img {
  width: 100%;
  height: auto;
  display: block;
}

.image-thumbnails {
  display: flex;
  gap: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.thumbnail.active {
  opacity: 1;
  border: 2px solid #007bff;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
}

.info-section {
  margin-bottom: 30px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.info-grid {
  display: grid;
  gap: 15px;
}

.info-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
}

.info-item label {
  color: #666;
  font-weight: 500;
}

.specifications ul {
  list-style: none;
  padding: 0;
}

.specifications li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  color: #666;
}

.specifications li:last-child {
  border-bottom: none;
}

.product-description {
  margin-top: 30px;
  line-height: 1.8;
  color: #333;
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
  .product-content {
    grid-template-columns: 1fr;
  }
  
  .product-images {
    position: static;
  }
}
</style> 