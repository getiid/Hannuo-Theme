<template>
  <div class="products">
    <!-- 产品分类 -->
    <div class="category-filter">
      <button 
        v-for="category in categories" 
        :key="category.id"
        :class="{ active: currentCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 产品列表 -->
    <div class="product-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.featured_media_url" :alt="product.title.rendered">
        </div>
        <div class="product-info">
          <h3 v-html="product.title.rendered"></h3>
          <div class="excerpt" v-html="product.excerpt.rendered"></div>
          <button class="view-details" @click="showProductDetail(product)">
            查看详情
          </button>
        </div>
      </div>
    </div>

    <!-- 产品详情弹窗 -->
    <div v-if="selectedProduct" class="product-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-button" @click="closeModal">&times;</button>
        <h2 v-html="selectedProduct.title.rendered"></h2>
        <div class="modal-body">
          <img 
            v-if="selectedProduct.featured_media_url" 
            :src="selectedProduct.featured_media_url" 
            :alt="selectedProduct.title.rendered"
          >
          <div class="product-description" v-html="selectedProduct.content.rendered"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProducts, getCategories } from '../api/wordpress'

const products = ref([])
const categories = ref([])
const currentCategory = ref(null)
const selectedProduct = ref(null)

// 过滤产品
const filteredProducts = computed(() => {
  if (!currentCategory.value) return products.value
  return products.value.filter(product => 
    product.categories.includes(currentCategory.value)
  )
})

// 选择分类
const selectCategory = (categoryId) => {
  currentCategory.value = currentCategory.value === categoryId ? null : categoryId
}

// 显示产品详情
const showProductDetail = (product) => {
  selectedProduct.value = product
  document.body.style.overflow = 'hidden'
}

// 关闭弹窗
const closeModal = () => {
  selectedProduct.value = null
  document.body.style.overflow = 'auto'
}

onMounted(async () => {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts(),
      getCategories()
    ])
    products.value = productsRes.data
    categories.value = categoriesRes.data
  } catch (error) {
    console.error('Failed to fetch products data:', error)
  }
})
</script>

<style lang="scss" scoped>
.products {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  .category-filter {
    margin-bottom: 3rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    button {
      padding: 0.5rem 1.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }

      &.active {
        background: #1890ff;
        color: white;
        border-color: #1890ff;
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

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

      .view-details {
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

  .product-modal {
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
        margin-bottom: 1.5rem;
        color: #333;
      }

      .modal-body {
        img {
          max-width: 100%;
          height: auto;
          margin-bottom: 1.5rem;
        }

        .product-description {
          line-height: 1.8;
          color: #666;
        }
      }
    }
  }
}
</style> 