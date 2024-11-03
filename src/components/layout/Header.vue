<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/" class="logo-text">
          汉诺化工
        </router-link>
      </div>
      
      <nav class="nav-menu">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/about" class="nav-item">关于我们</router-link>
        <router-link to="/products" class="nav-item">产品中心</router-link>
        <router-link to="/production" class="nav-item">研发生产</router-link>
        <router-link to="/news" class="nav-item">新闻动态</router-link>
        <router-link to="/contact" class="nav-item">联系我们</router-link>
      </nav>

      <div class="menu-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="mobile-menu" :class="{ active: isMenuOpen }">
      <router-link to="/" class="mobile-nav-item" @click="closeMenu">首页</router-link>
      <router-link to="/about" class="mobile-nav-item" @click="closeMenu">关于我们</router-link>
      <router-link to="/products" class="mobile-nav-item" @click="closeMenu">产品中心</router-link>
      <router-link to="/production" class="mobile-nav-item" @click="closeMenu">研发生产</router-link>
      <router-link to="/news" class="mobile-nav-item" @click="closeMenu">新闻动态</router-link>
      <router-link to="/contact" class="mobile-nav-item" @click="closeMenu">联系我们</router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    .logo-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .nav-menu {
    display: flex;
    gap: 2rem;

    @media (max-width: 768px) {
      display: none;
    }

    .nav-item {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: #1890ff;
        transition: width 0.3s;
      }

      &:hover::after,
      &.router-link-active::after {
        width: 100%;
      }
    }
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;

    @media (max-width: 768px) {
      display: flex;
    }

    span {
      width: 24px;
      height: 2px;
      background: #333;
      transition: all 0.3s;
    }
  }

  .mobile-menu {
    display: none;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transform: translateY(-100%);
    transition: transform 0.3s;

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }

    &.active {
      transform: translateY(0);
    }

    .mobile-nav-item {
      text-decoration: none;
      color: #333;
      padding: 1rem;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      &.router-link-active {
        color: #1890ff;
      }
    }
  }
}
</style> 