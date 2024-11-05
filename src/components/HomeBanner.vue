<template>
  <div class="banner-container">
    <div class="banner-slider" ref="sliderRef">
      <div v-for="(slide, index) in bannerData" 
           :key="index" 
           class="banner-slide"
           :class="{ active: currentSlide === index }">
        <img :src="slide.image" :alt="slide.title">
        <div class="slide-content">
          <h2>{{ slide.title }}</h2>
          <p>{{ slide.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- 导航按钮 -->
    <div class="banner-nav">
      <button class="prev" @click="prevSlide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="next" @click="nextSlide">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    
    <!-- 指示器 -->
    <div class="banner-indicators">
      <span v-for="(_, index) in bannerData" 
            :key="index"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)">
      </span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'HomeBanner',
  props: {
    bannerData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const currentSlide = ref(0)
    const sliderRef = ref(null)
    let autoplayInterval = null
    
    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % props.bannerData.length
    }
    
    const prevSlide = () => {
      currentSlide.value = currentSlide.value === 0 
        ? props.bannerData.length - 1 
        : currentSlide.value - 1
    }
    
    const goToSlide = (index) => {
      currentSlide.value = index
    }
    
    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 5000)
    }
    
    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval)
      }
    }
    
    onMounted(() => {
      startAutoplay()
      
      // 鼠标悬停时暂停自动播放
      if (sliderRef.value) {
        sliderRef.value.addEventListener('mouseenter', stopAutoplay)
        sliderRef.value.addEventListener('mouseleave', startAutoplay)
      }
    })
    
    onUnmounted(() => {
      stopAutoplay()
      if (sliderRef.value) {
        sliderRef.value.removeEventListener('mouseenter', stopAutoplay)
        sliderRef.value.removeEventListener('mouseleave', startAutoplay)
      }
    })
    
    return {
      currentSlide,
      sliderRef,
      nextSlide,
      prevSlide,
      goToSlide
    }
  }
}
</script>

<style scoped>
.banner-container {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
}

.banner-slider {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.banner-slide.active {
  opacity: 1;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  width: 80%;
  max-width: 800px;
}

.slide-content h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease 0.3s;
}

.slide-content p {
  font-size: 1.2em;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease 0.5s;
}

.banner-slide.active .slide-content h2,
.banner-slide.active .slide-content p {
  opacity: 1;
  transform: translateY(0);
}

.banner-nav button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 2;
}

.banner-nav button:hover {
  background: rgba(0,0,0,0.8);
}

.banner-nav .prev {
  left: 20px;
}

.banner-nav .next {
  right: 20px;
}

.banner-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.banner-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-indicators span.active {
  background: white;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .banner-container {
    height: 400px;
  }
  
  .slide-content h2 {
    font-size: 1.8em;
  }
  
  .slide-content p {
    font-size: 1em;
  }
}
</style> 