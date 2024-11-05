<template>
  <div class="features-section">
    <div class="features-grid">
      <div v-for="(feature, index) in features" 
           :key="index"
           class="feature-item"
           :class="`feature-${index + 1}`">
        <div class="feature-icon">
          <img :src="feature.icon" :alt="feature.title">
        </div>
        <div class="feature-content">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeFeatures',
  props: {
    features: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.features-section {
  padding: 60px 0;
  background: #fff;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  padding: 0 20px;
}

.feature-item {
  text-align: center;
  padding: 30px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #007bff;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.feature-item:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.feature-item:hover .feature-icon img {
  transform: scale(1.1);
}

.feature-content h3 {
  color: #333;
  font-size: 1.3em;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-content p {
  color: #666;
  line-height: 1.6;
  font-size: 0.95em;
}

/* 为每个特色块添加不同的顶部边框颜色 */
.feature-1::before { background: #007bff; }
.feature-2::before { background: #28a745; }
.feature-3::before { background: #fd7e14; }
.feature-4::before { background: #6f42c1; }

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-item {
    padding: 20px;
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
  }
}
</style> 