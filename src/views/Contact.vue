<template>
  <div class="contact-page">
    <!-- Banner部分 -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>联系我们</h1>
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <span class="current">联系我们</span>
        </div>
      </div>
    </div>

    <div class="contact-container">
      <!-- 页面主标题 -->
      <div class="section-title">
        <h2>联系我们</h2>
        <div class="title-line"></div>
        <p class="subtitle">CONTACT US</p>
      </div>

      <div class="contact-content">
        <!-- 联系信息部分 -->
        <div class="contact-info">
          <div class="info-card">
            <div class="info-item">
              <div class="icon-wrapper">
                <i class="icon location"></i>
              </div>
              <div class="info-text">
                <h3>公司地址</h3>
                <p>{{ contactInfo.address }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-wrapper">
                <i class="icon phone"></i>
              </div>
              <div class="info-text">
                <h3>联系电话</h3>
                <p>{{ contactInfo.phone }}</p>
              </div>
            </div>

            <div class="info-item">
              <div class="icon-wrapper">
                <i class="icon email"></i>
              </div>
              <div class="info-text">
                <h3>电子邮箱</h3>
                <p>{{ contactInfo.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 地图图片部分 -->
        <div class="location-image">
          <img src="@/assets/images/location.jpg" alt="公司位置" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPages } from '../api/wordpress'

const contactInfo = ref({
  address: '山东省济南市天桥区',
  phone: '0531-88888888',
  email: 'contact@hannuocm.com'
})

onMounted(async () => {
  try {
    const response = await getPages()
    const contactPage = response.data.find(page => page.slug === 'contact')
    if (contactPage) {
      contactInfo.value = {
        address: contactPage.acf?.address || contactInfo.value.address,
        phone: contactPage.acf?.phone || contactInfo.value.phone,
        email: contactPage.acf?.email || contactInfo.value.email
      }
    }
  } catch (error) {
    console.error('Failed to fetch contact info:', error)
  }
})
</script>

<style lang="scss" scoped>
.contact-page {
  .page-banner {
    height: 200px;
    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
                url('@/assets/images/contact-banner.jpg') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;

    .banner-content {
      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        font-weight: 300;
      }

      .breadcrumb {
        a {
          color: white;
          text-decoration: none;
          &:hover {
            color: #1890ff;
          }
        }

        .separator {
          margin: 0 0.5rem;
        }

        .current {
          color: #1890ff;
        }
      }
    }
  }

  .contact-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;

    .section-title {
      text-align: center;
      margin-bottom: 4rem;

      h2 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 1rem;
        font-weight: 500;
      }

      .title-line {
        width: 60px;
        height: 3px;
        background: #1890ff;
        margin: 1rem auto;
      }

      .subtitle {
        color: #999;
        font-size: 1.2rem;
        letter-spacing: 2px;
      }
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }

      .contact-info {
        .info-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 2rem;

          .info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 2rem;
            padding: 1rem;
            transition: transform 0.3s;

            &:hover {
              transform: translateX(10px);
            }

            &:last-child {
              margin-bottom: 0;
            }

            .icon-wrapper {
              width: 50px;
              height: 50px;
              background: #1890ff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 1rem;

              .icon {
                width: 24px;
                height: 24px;
                filter: brightness(0) invert(1);
              }
            }

            .info-text {
              h3 {
                font-size: 1.2rem;
                color: #333;
                margin-bottom: 0.5rem;
              }

              p {
                color: #666;
                line-height: 1.6;
              }
            }
          }
        }
      }

      .location-image {
        img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      }
    }
  }
}
</style> 