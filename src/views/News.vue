<template>
  <div class="news-page">
    <div class="news-header">
      <h1>新闻动态</h1>
      <p class="subtitle">了解汉诺化工的最新动态和行业资讯</p>
    </div>
    <NewsList />
  </div>
</template>

<script>
import NewsList from '../components/NewsList.vue'

export default {
  name: 'News',
  components: {
    NewsList
  }
}
</script>

<style scoped>
.news-page {
  padding: 40px 20px;
}

.news-header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.1em;
}
</style> 