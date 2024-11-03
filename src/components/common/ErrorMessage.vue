<template>
  <transition name="fade">
    <div v-if="show" class="error-message" :class="type">
      <div class="error-content">
        <span class="icon">{{ icon }}</span>
        <span class="message">{{ message }}</span>
      </div>
      <button v-if="closable" class="close-btn" @click="handleClose">&times;</button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'success', 'info'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const icon = computed(() => {
  const icons = {
    error: '✕',
    warning: '⚠',
    success: '✓',
    info: 'ℹ'
  }
  return icons[props.type]
})

const handleClose = () => {
  emit('close')
}

if (props.duration > 0) {
  setTimeout(() => {
    emit('close')
  }, props.duration)
}
</script>

<style lang="scss" scoped>
.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 600px;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);

  &.error {
    background: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
  }

  &.warning {
    background: #fffbe6;
    border: 1px solid #ffe58f;
    color: #faad14;
  }

  &.success {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    color: #52c41a;
  }

  &.info {
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    color: #1890ff;
  }

  .error-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    font-size: 1.2rem;
  }

  .message {
    font-size: 0.9rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 0 0 1rem;
    color: inherit;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 