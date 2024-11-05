<template>
  <div class="contact-page">
    <div class="contact-header">
      <h1>联系我们</h1>
    </div>
    
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="contactInfo" class="contact-content">
      <!-- 公司信息部分 -->
      <div class="company-info">
        <h2>{{ contactInfo.company_name }}</h2>
        <div class="info-items">
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ contactInfo.address }}</span>
          </div>
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <span>{{ contactInfo.phone }}</span>
          </div>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <span>{{ contactInfo.email }}</span>
          </div>
        </div>

        <!-- 工作时间 -->
        <div class="working-hours" v-if="contactInfo.working_hours && contactInfo.working_hours.length">
          <h3>工作时间</h3>
          <div v-for="(hours, index) in contactInfo.working_hours" :key="index" class="time-slot">
            {{ hours.description }}
          </div>
        </div>

        <!-- 社交媒体 -->
        <div class="social-media" v-if="contactInfo.social_media">
          <h3>关注我们</h3>
          <div class="social-links">
            <a v-for="(social, index) in contactInfo.social_media" 
               :key="index"
               :href="social.url"
               target="_blank"
               rel="noopener noreferrer">
              <img :src="social.icon" :alt="social.platform">
            </a>
          </div>
        </div>
      </div>

      <!-- 联系表单 -->
      <div class="contact-form">
        <h2>在线留言</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <input type="text" v-model="form.name" placeholder="您的姓名" required>
          </div>
          <div class="form-group">
            <input type="email" v-model="form.email" placeholder="电子邮箱" required>
          </div>
          <div class="form-group">
            <input type="tel" v-model="form.phone" placeholder="联系电话">
          </div>
          <div class="form-group">
            <textarea v-model="form.message" placeholder="留言内容" required></textarea>
          </div>
          <button type="submit" :disabled="submitting">
            {{ submitting ? '提交中...' : '发送消息' }}
          </button>
        </form>
      </div>

      <!-- 地图部分 -->
      <div class="map-container" v-if="contactInfo?.map_coordinates">
        <div id="baiduMap" ref="mapContainer"></div>
      </div>
    </div>
    
    <div v-else class="no-data">
      暂无联系方式信息
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import wpApi from '../services/wp-api'

export default {
  name: 'Contact',
  setup() {
    const contactInfo = ref(null)
    const mapInstance = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const submitting = ref(false)
    
    // 添加表单数据
    const form = ref({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    const initMap = () => {
        if (!window.BMap) {
            console.error('BaiduMap API not loaded');
            return;
        }
        
        if (contactInfo.value?.map_coordinates) {
            try {
                const { latitude, longitude } = contactInfo.value.map_coordinates;
                console.log('Using coordinates:', { latitude, longitude });
                
                // 创建地图实例
                const map = new window.BMap.Map("baiduMap");
                
                // 创建点坐标
                const point = new window.BMap.Point(longitude, latitude);
                
                // 初始化地图，设置中心点坐标和地图级别
                map.centerAndZoom(point, 17);
                
                // 添加地图控件
                map.addControl(new window.BMap.NavigationControl());
                map.addControl(new window.BMap.ScaleControl());
                map.addControl(new window.BMap.OverviewMapControl());
                
                // 启用滚轮缩放
                map.enableScrollWheelZoom(true);
                
                // 添加标记
                const marker = new window.BMap.Marker(point);
                map.addOverlay(marker);
                
                // 创建信息窗口
                const infoWindow = new window.BMap.InfoWindow(`
                    <div style="padding: 8px">
                        <h4 style="margin: 0 0 5px 0;font-size:14px;">${contactInfo.value.company_name}</h4>
                        <p style="margin: 5px 0;font-size:12px;">${contactInfo.value.address}</p>
                        <p style="margin: 5px 0;font-size:12px;">电话：${contactInfo.value.phone}</p>
                    </div>
                `, {
                    width: 250,
                    height: 100,
                    title: ''
                });
                
                // 点击标记显示信息窗口
                marker.addEventListener("click", () => {
                    map.openInfoWindow(infoWindow, point);
                });
                
                // 默认打开信息窗口
                map.openInfoWindow(infoWindow, point);
                
                mapInstance.value = map;
            } catch (error) {
                console.error('Map initialization error:', error);
            }
        }
    }

    const fetchContactInfo = async () => {
        try {
            loading.value = true;
            console.log('Starting to fetch contact info...');
            
            const response = await wpApi.getContactInfo();
            console.log('Contact info received:', response);
            
            if (!response) {
                throw new Error('返回数据为空');
            }
            
            // 验证必要字段
            if (!response.company_name || !response.address) {
                throw new Error('缺少必要的联系信息');
            }
            
            contactInfo.value = response;
            
            // 初始化地图
            if (response.map_coordinates) {
                nextTick(() => {
                    try {
                        console.log('Initializing map with coordinates:', response.map_coordinates);
                        const coords = convertCoordinates(response.map_coordinates);
                        if (coords) {
                            contactInfo.value.map_coordinates = coords;
                            initMap();
                        } else {
                            console.error('Failed to convert coordinates');
                        }
                    } catch (mapError) {
                        console.error('Map initialization error:', mapError);
                        error.value = '地图加载失败';
                    }
                });
            }
        } catch (err) {
            console.error('Error in fetchContactInfo:', err);
            error.value = err.message || '加载联系方式信息失败，请稍后重试';
        } finally {
            loading.value = false;
        }
    };

    // 修改坐标转换函数
    const convertCoordinates = (coords) => {
        if (!coords) return null;
        
        try {
            // 处理度分秒格式
            const parseDMS = (dms) => {
                // 移除所有空格并添加方向标识
                dms = dms.replace(/\s/g, '');
                // 使用新的正则表达式匹配格式
                const match = dms.match(/(\d+)°(\d+)'([\d.]+)"([N|S|E|W])/);
                if (!match) {
                    console.error('Invalid DMS format:', dms);
                    return null;
                }
                
                const degrees = parseFloat(match[1]);
                const minutes = parseFloat(match[2]);
                const seconds = parseFloat(match[3]);
                const direction = match[4];
                
                let decimal = degrees + (minutes / 60) + (seconds / 3600);
                
                // 根据方向调整坐标值
                if (direction === 'S' || direction === 'W') {
                    decimal = -decimal;
                }
                
                return decimal;
            };
            
            const lat = parseDMS(coords.latitude);
            const lng = parseDMS(coords.longitude);
            
            console.log('Parsed coordinates:', { lat, lng });
            
            if (lat === null || lng === null) {
                throw new Error('Invalid coordinates format');
            }
            
            return {
                latitude: lat,
                longitude: lng
            };
        } catch (error) {
            console.error('Coordinate conversion error:', error);
            return null;
        }
    };

    onMounted(() => {
      fetchContactInfo()
    })

    return {
      contactInfo,
      loading,
      error,
      form,
      submitting
    }
  }
}
</script>

<style scoped>
.contact-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 40px;
}

.company-info {
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-items {
  margin: 20px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.info-item i {
  margin-right: 10px;
  color: #007bff;
}

.contact-form {
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  height: 150px;
}

button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
}

.map-container {
  grid-column: 1 / -1;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 40px;
}

#baiduMap {
  width: 100%;
  height: 100%;
}

.social-media {
  margin-top: 30px;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.social-links img {
  width: 30px;
  height: 30px;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
}

.loading, .error, .no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #dc3545;
}

.time-slot {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.time-slot:last-child {
  border-bottom: none;
}

.info-item {
  padding: 10px 0;
}

.info-item i {
  width: 20px;
  text-align: center;
}

.map-container {
  margin-top: 40px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}
</style> 