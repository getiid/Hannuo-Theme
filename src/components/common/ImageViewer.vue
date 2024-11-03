<template>
  <transition name="fade">
    <div v-if="show" class="image-viewer" @click.self="handleClose">
      <div class="viewer-content">
        <div class="image-container">
          <img :src="currentImage" :alt="altText">
        </div>
        
        <!-- 导航按钮 -->
        <button 
          v-if="showNavigation" 
          class="nav-btn prev" 
          @click="prevImage"
          :disabled="currentIndex === 0"
        >
          &#10094;
        </button>
        <button 
          v-if="showNavigation" 
          class="nav-btn next" 
          @click="nextImage"
          :disabled="currentIndex === images.length - 1"
        >
          &#10095;
        </button>

        <!-- 关闭按钮 -->
        <button class="close-btn" @click="handleClose">&times;</button>

        <!-- 缩略图 -->
        <div v-if="showThumbnails && images.length > 1" class="thumbnails">
          <div 
            v-for="(img, index) in images" 
            :key="index"
            class="thumbnail"
            :class="{ active: index === currentIndex }"
            @click="setImage(index)"
          >
            <img :src="img" :alt="`缩略图 ${index + 1}`">
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  images: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  showThumbnails: {
    type: Boolean,
    default: true
  },
  altText: {
    type: String,
    default: '图片预览'
  }
})

const emit = defineEmits(['close', 'change'])

const currentIndex = ref(props.initialIndex)

const currentImage = computed(() => props.images[currentIndex.value])
const showNavigation = computed(() => props.images.length > 1)

watch(() => props.initialIndex, (newVal) => {
  currentIndex.value = newVal
})

const handleClose = () => {
  emit('close')
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    emit('change', currentIndex.value)
  }
}

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
    emit('change', currentIndex.value)
  }
}

const setImage = (index) => {
  currentIndex.value = index
  emit('change', index)
}
</script>

<style lang="scss" scoped>
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .viewer-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
    }
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 1rem;
    cursor: pointer;
    font-size: 1.5rem;
    border-radius: 50%;
    transition: all 0.3s;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    &.prev {
      left: 1rem;
    }

    &.next {
      right: 1rem;
    }
  }

  .close-btn {
    position: absolute;
    top: -2rem;
    right: -2rem;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }

  .thumbnails {
    position: absolute;
    bottom: -100px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;

    .thumbnail {
      width: 60px;
      height: 60px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        border-color: #1890ff;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &:hover {
        transform: translateY(-2px);
      }
    }
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