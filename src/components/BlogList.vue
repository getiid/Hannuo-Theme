<template>
  <div class="blog-list">
    <div v-for="post in posts" :key="post.id" class="blog-item">
      <h2 v-html="post.title.rendered"></h2>
      <div v-html="post.excerpt.rendered"></div>
    </div>
    <div class="pagination">
      <button @click="loadMore" :disabled="loading">加载更多</button>
    </div>
  </div>
</template>

<script>
import wpApi from '../services/wp-api';

export default {
  name: 'BlogList',
  data() {
    return {
      posts: [],
      currentPage: 1,
      loading: false
    }
  },
  methods: {
    async fetchPosts() {
      this.loading = true;
      try {
        const posts = await wpApi.getPosts(this.currentPage);
        this.posts = [...this.posts, ...posts];
        this.currentPage += 1;
      } catch (error) {
        console.error('加载文章失败', error);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.fetchPosts();
    }
  },
  mounted() {
    this.fetchPosts();
  }
}
</script> 