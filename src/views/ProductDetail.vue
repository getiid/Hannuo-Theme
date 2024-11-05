<template>
  <div class="product-detail" v-if="product">
    <div class="product-header">
      <h1 v-html="product.title.rendered"></h1>
    </div>
    
    <div class="product-content">
      <div class="product-image" v-if="product.featured_image">
        <img :src="product.featured_image" :alt="product.title.rendered">
      </div>
      
      <div class="product-info">
        <div class="product-description" v-html="product.content.rendered"></div>
        
        <!-- ACF字段显示 -->
        <div class="product-specs" v-if="product.acf">
          <h3>产品规格</h3>
          <div v-for="(value, key) in product.acf" :key="key" class="spec-item">
            <span class="spec-label">{{ key }}:</span>
            <span class="spec-value">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
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

    const fetchProduct = async () => {
      try {
        const response = await wpApi.getProduct(route.params.id)
        product.value = response
      } catch (error) {
        console.error('获取产品详情失败:', error)
      }
    }

    onMounted(() => {
      fetchProduct()
    })

    return {
      product
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

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  padding: 20px;
}

.product-description {
  margin-bottom: 30px;
}

.product-specs {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.spec-item {
  margin: 10px 0;
  display: flex;
  gap: 10px;
}

.spec-label {
  font-weight: bold;
  min-width: 100px;
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
  }
}
</style> 