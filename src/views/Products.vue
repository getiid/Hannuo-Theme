<template>
  <div class="products-page">
    <div class="products-header">
      <h1>产品中心</h1>
    </div>
    
    <div class="products-container">
      <!-- 左侧分类导航 -->
      <ProductCategoryNav class="category-nav" />
      
      <!-- 右侧产品列表 -->
      <div class="product-list-container">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="fetchProducts">重试</button>
        </div>
        
        <div v-else-if="products.length === 0" class="empty-state">
          暂无产品
        </div>
        
        <div v-else class="products-grid">
          <div v-for="product in products" 
               :key="product.id" 
               class="product-card"
               @click="goToDetail(product.id)">
            <div class="product-image">
              <img :src="product.product_images?.[0] || '/placeholder.jpg'" 
                   :alt="product.title.rendered">
            </div>
            <div class="product-info">
              <h3 class="product-title" v-html="product.title.rendered"></h3>
              <p class="product-cas">CAS: {{ product.acf.cas }}</p>
              <div class="product-meta">
                <span class="product-purity" v-if="product.acf.purity">
                  纯度: {{ product.acf.purity }}
                </span>
                <span class="product-packaging">
                  {{ product.acf.packaging }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页加载 -->
        <div class="pagination" v-if="hasMore && !loading">
          <button @click="loadMore">加载更多</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCategoryNav from '../components/ProductCategoryNav.vue'
import wpApi from '../services/wp-api'

export default {
  name: 'Products',
  components: {
    ProductCategoryNav
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const products = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const hasMore = ref(true)

    const fetchProducts = async (reset = false) => {
      try {
        if (reset) {
          currentPage.value = 1
          products.value = []
        }
        
        loading.value = true
        error.value = null
        
        const response = await wpApi.getProducts(
          currentPage.value,
          10,
          route.params.categoryId
        )
        
        if (response.length < 10) {
          hasMore.value = false
        }
        
        if (reset) {
          products.value = response
        } else {
          products.value = [...products.value, ...response]
        }
        
        currentPage.value++
      } catch (err) {
        console.error('获取产品列表失败:', err)
        error.value = '加载产品失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    const loadMore = () => {
      if (!loading.value) {
        fetchProducts()
      }
    }

    const goToDetail = (productId) => {
      router.push(`/products/${productId}`)
    }

    // 监听分类变化
    watch(() => route.params.categoryId, () => {
      fetchProducts(true)
    })

    onMounted(() => {
      fetchProducts()
    })

    return {
      products,
      loading,
      error,
      hasMore,
      loadMore,
      goToDetail
    }
  }
}
</script>

<style scoped>
.products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.products-header {
  text-align: center;
  margin-bottom: 40px;
}

.products-header h1 {
  font-size: 2em;
  color: #333;
}

.products-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-title {
  margin: 0 0 10px 0;
  font-size: 1.2em;
  color: #333;
}

.product-cas {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #666;
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
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination {
  text-align: center;
  margin-top: 40px;
}

.pagination button {
  padding: 10px 30px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .products-container {
    grid-template-columns: 1fr;
  }
}
</style> 