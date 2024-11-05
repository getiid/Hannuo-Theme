<template>
  <div class="home-products">
    <div class="section-header">
      <h2>产品中心</h2>
      <div class="divider"></div>
    </div>
    
    <div class="products-grid" v-if="productData">
      <!-- 氨基酸分类 -->
      <div class="product-category amino-acids"
           @click="goToCategory('amino-acids')"
           :style="{ backgroundImage: `url(${productData.amino_acids.image})` }">
        <div class="category-content">
          <h3>氨基酸</h3>
          <p>{{ productData.amino_acids.description }}</p>
          <div class="category-link">
            查看更多 <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
      
      <!-- 试剂分类 -->
      <div class="product-category reagents"
           @click="goToCategory('reagents')"
           :style="{ backgroundImage: `url(${productData.reagents.image})` }">
        <div class="category-content">
          <h3>试剂</h3>
          <p>{{ productData.reagents.description }}</p>
          <div class="category-link">
            查看更多 <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomeProducts',
  props: {
    productData: {
      type: Object,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    
    const goToCategory = (category) => {
      router.push({
        path: '/products',
        query: { category }
      })
    }
    
    return {
      goToCategory
    }
  }
}
</script>

<style scoped>
.home-products {
  padding: 80px 0;
  background: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

h2 {
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

.products-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 0 20px;
}

.product-category {
  position: relative;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-category::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7));
  transition: background 0.3s ease;
}

.product-category:hover {
  transform: translateY(-5px);
}

.product-category:hover::before {
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
}

.category-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 40px;
  color: white;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.product-category:hover .category-content {
  transform: translateY(0);
}

.category-content h3 {
  font-size: 1.8em;
  margin-bottom: 15px;
}

.category-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  opacity: 0.9;
}

.category-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s ease;
}

.product-category:hover .category-link {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .product-category {
    height: 300px;
  }
}
</style> 