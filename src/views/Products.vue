<template>
  <div class="products-page">
    <div class="products-header">
      <h1>产品中心</h1>
    </div>
    
    <div class="products-container">
      <!-- 左侧分类导航 -->
      <div class="left-sidebar">
        <div class="category-nav">
          <h2>产品分类</h2>
          <ul class="main-categories">
            <li v-for="category in mainCategories" 
                :key="category.id"
                :class="{ active: currentCategory === category.id }"
                @click="selectCategory(category.id)">
              {{ category.name }}
            </li>
          </ul>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-box">
          <input type="text" 
                 v-model="searchQuery" 
                 placeholder="搜索产品名称或CAS号"
                 @input="handleSearch">
        </div>
      </div>
      
      <!-- 右侧内容区 -->
      <div class="content-area">
        <!-- 二级分类导航 -->
        <div class="sub-categories" v-if="subCategories.length">
          <ul>
            <li v-for="category in subCategories" 
                :key="category.id"
                :class="{ active: currentSubCategory === category.id }"
                @click="selectSubCategory(category.id)">
              {{ category.name }}
            </li>
          </ul>
        </div>
        
        <!-- 产品列表 -->
        <div class="product-list">
          <!-- 列表头部 -->
          <div class="list-header">
            <div class="col product-name">产品名称</div>
            <div class="col product-cas">CAS号</div>
            <div class="col product-packaging">包装</div>
          </div>
          
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button @click="fetchProducts">重试</button>
          </div>
          
          <!-- 空状态 -->
          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            暂无产品
          </div>
          
          <!-- 产品列表 -->
          <div v-else class="list-content">
            <div v-for="product in filteredProducts" 
                 :key="product.id" 
                 class="product-row"
                 @click="goToDetail(product.id)">
              <div class="col product-name" v-html="product.title.rendered"></div>
              <div class="col product-cas">{{ product.acf.cas }}</div>
              <div class="col product-packaging">{{ product.acf.packaging }}</div>
            </div>
          </div>
          
          <!-- 分页加载 -->
          <div class="pagination" v-if="hasMore && !loading">
            <button @click="loadMore">加载更多</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import wpApi from '../services/wp-api'

export default {
  name: 'Products',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const products = ref([])
    const categories = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const hasMore = ref(true)
    const searchQuery = ref('')
    const currentCategory = ref(null)
    const currentSubCategory = ref(null)

    // 获取一级分类
    const mainCategories = computed(() => {
      return categories.value.filter(cat => cat.parent === 0)
    })

    // 获取当前一级分类下的二级分类
    const subCategories = computed(() => {
      if (!currentCategory.value) return []
      return categories.value.filter(cat => cat.parent === currentCategory.value)
    })

    // 过滤后的产品列表
    const filteredProducts = computed(() => {
      let result = products.value
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase().trim()
        result = result.filter(product => {
          const title = product.title.rendered.toLowerCase()
          const cas = (product.acf?.cas || '').toLowerCase()
          return title.includes(query) || cas.includes(query)
        })
      }
      
      return result
    })

    // 获取分类数据
    const fetchCategories = async () => {
      try {
        const response = await wpApi.getProductCategories()
        categories.value = response
      } catch (error) {
        console.error('获取分类失败:', error)
      }
    }

    // 获取产品列表
    const fetchProducts = async (reset = false) => {
      try {
        if (reset) {
          currentPage.value = 1
          products.value = []
          hasMore.value = true
        }
        
        loading.value = true
        error.value = null
        
        const response = await wpApi.getProducts(
          currentPage.value,
          10,
          currentSubCategory.value || currentCategory.value
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

    const selectCategory = (categoryId) => {
      currentCategory.value = categoryId
      currentSubCategory.value = null
      fetchProducts(true)
    }

    const selectSubCategory = (categoryId) => {
      currentSubCategory.value = categoryId
      fetchProducts(true)
    }

    const handleSearch = () => {
      // 移除重新请求API的操作
      // fetchProducts(true)  // 删除这行
    }

    const loadMore = () => {
      if (!loading.value) {
        fetchProducts()
      }
    }

    const goToDetail = (productId) => {
      router.push(`/products/${productId}`)
    }

    onMounted(() => {
      fetchCategories()
      fetchProducts()
    })

    return {
      products,
      loading,
      error,
      hasMore,
      searchQuery,
      currentCategory,
      currentSubCategory,
      mainCategories,
      subCategories,
      filteredProducts,
      loadMore,
      goToDetail,
      selectCategory,
      selectSubCategory,
      handleSearch
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

.products-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
}

.left-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-nav {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.category-nav h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.2em;
}

.main-categories {
  list-style: none;
  padding: 0;
  margin: 0;
}

.main-categories li {
  padding: 12px 15px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.main-categories li:hover {
  background: #f8f9fa;
  color: #007bff;
}

.main-categories li.active {
  background: #f8f9fa;
  color: #007bff;
}

.search-box {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-box input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #007bff;
}

.search-box input::placeholder {
  color: #999;
}

.sub-categories {
  margin-bottom: 30px;
}

.sub-categories ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.sub-categories li {
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.sub-categories li:hover {
  background: #e9ecef;
  color: #007bff;
}

.sub-categories li.active {
  background: #007bff;
  color: white;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
  color: #333;
}

.product-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.product-row:hover {
  background: #f8f9fa;
}

.col {
  padding: 0 10px;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.pagination {
  text-align: center;
  margin-top: 30px;
}

.pagination button {
  padding: 10px 30px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .products-container {
    grid-template-columns: 1fr;
  }
}
</style> 