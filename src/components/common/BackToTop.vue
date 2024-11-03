<template>
  <transition name="fade">
    <div 
      v-show="visible" 
      class="back-to-top"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path 
          fill="currentColor" 
          d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
        />
      </svg>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const scrollThreshold = 300

const checkScroll = () => {
  visible.value = window.pageYOffset > scrollThreshold
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 40px;
  height: 40px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s;

  &:hover {
    background: #40a9ff;
    transform: translateY(-2px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 