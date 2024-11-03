<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 公司信息 -->
      <div class="company-info">
        <h3 class="company-name">汉诺化工</h3>
        <p class="company-desc">专业的化工产品供应商</p>
      </div>

      <!-- 联系方式 -->
      <div class="contact-info">
        <h3>联系我们</h3>
        <p><i class="icon location"></i> 山东省济南市天桥区</p>
        <p><i class="icon phone"></i> 0531-88888888</p>
        <p><i class="icon email"></i> contact@hannuocm.com</p>
      </div>

      <!-- 快速链接 -->
      <div class="quick-links">
        <h3>快速链接</h3>
        <router-link to="/">首页</router-link>
        <router-link to="/about">关于我们</router-link>
        <router-link to="/products">产品中心</router-link>
        <router-link to="/production">研发生产</router-link>
        <router-link to="/news">新闻动态</router-link>
        <router-link to="/contact">联系我们</router-link>
      </div>
    </div>
    
    <!-- 版权信息 -->
    <div class="copyright">
      <p>&copy; {{ currentYear }} 汉诺化工. 保留所有权利.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
.footer {
  background: #333;
  color: #fff;
  padding: 4rem 0 0;
  margin-top: 4rem;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 3rem;

    h3 {
      color: #fff;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }

    .company-info {
      .company-name {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .company-desc {
        color: #999;
        line-height: 1.6;
      }
    }

    .contact-info {
      p {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        color: #999;

        .icon {
          width: 16px;
          height: 16px;
          margin-right: 0.5rem;
          filter: invert(1);
          opacity: 0.6;
        }
      }
    }

    .quick-links {
      display: flex;
      flex-direction: column;

      a {
        color: #999;
        text-decoration: none;
        margin-bottom: 0.5rem;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .copyright {
    border-top: 1px solid #444;
    padding: 1.5rem;
    text-align: center;

    p {
      color: #666;
      font-size: 0.9rem;
    }
  }
}
</style> 