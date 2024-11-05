<template>
  <div class="product-list">
    <div v-for="product in products" :key="product.id" class="product-item">
      <img v-if="product.featured_image" :src="product.featured_image" :alt="product.title.rendered">
      <h3 v-html="product.title.rendered"></h3>
      <div v-html="product.excerpt.rendered"></div>
    </div>
    <div class="pagination" v-if="hasMore">
      <button @click="loadMore" :disabled="loading">加载更多</button>
    </div>
  </div>
</template>

<script>
import wpApi from '../services/wp-api';

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      currentPage: 1,
      loading: false,
      hasMore: true
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await wpApi.getProducts(this.currentPage);
        if (response.length < 10) { // 假设每页10条
          this.hasMore = false;
        }
        this.products = [...this.products, ...response];
        this.currentPage += 1;
      } catch (error) {
        console.error('加载产品失败', error);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.fetchProducts();
    }
  },
  mounted() {
    this.fetchProducts();
  }
}
</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.product-item {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
}

.product-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}
</style> 