<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被移除。</p>
      <router-link to="/" class="home-link">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #f8f9fa;
}

.not-found-content {
  padding: 40px;
}

h1 {
  font-size: 120px;
  margin: 0;
  color: #007bff;
  line-height: 1;
}

h2 {
  font-size: 30px;
  margin: 20px 0;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 30px;
}

.home-link {
  display: inline-block;
  padding: 12px 30px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  h1 {
    font-size: 80px;
  }
  
  h2 {
    font-size: 24px;
  }
}
</style> 