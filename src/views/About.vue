<template>
  <div class="about">
    <!-- 公司简介 -->
    <section class="company-intro">
      <h1>关于我们</h1>
      <div class="content-grid">
        <div class="text-content">
          <p class="highlight">汉诺化工专注于化工产品的研发、生产和销售</p>
          <div class="description" v-html="aboutContent"></div>
        </div>
        <div class="intro-summary">
          <h3>企业概况</h3>
          <p>汉诺化工成立于2010年，是一家专业从事化工产品研发、生产和销售的现代化企业。公司始终秉承"诚信、创新、共赢、责任"的核心价值观，致力于为客户提供优质的产品和服务。</p>
        </div>
      </div>
    </section>

    <!-- 企业文化 -->
    <section class="culture">
      <h2>企业文化</h2>
      <div class="culture-grid">
        <div class="culture-item" v-for="(item, index) in cultureItems" :key="index">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- 发展历程 -->
    <section class="history">
      <h2>发展历程</h2>
      <div class="timeline">
        <div 
          v-for="(event, index) in historyEvents" 
          :key="index"
          class="timeline-item"
          :class="{ 'right': index % 2 === 1 }"
        >
          <div class="content">
            <span class="year">{{ event.year }}</span>
            <h3>{{ event.title }}</h3>
            <p>{{ event.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPages } from '../api/wordpress'

const aboutContent = ref('')

const cultureItems = [
  {
    title: '企业使命',
    description: '为客户创造价值，为员工创造机会，为社会创造效益'
  },
  {
    title: '企业愿景',
    description: '成为化工行业的领军企业'
  },
  {
    title: '核心价值观',
    description: '诚信、创新、共赢、责任'
  },
  {
    title: '企业精神',
    description: '团结协作、追求卓越'
  }
]

const historyEvents = [
  {
    year: '2010',
    title: '公司成立',
    description: '汉诺化工正式成立'
  },
  {
    year: '2015',
    title: '技术突破',
    description: '成功研发多项核心技术'
  },
  {
    year: '2018',
    title: '规模扩张',
    description: '新建现代化生产基地'
  },
  {
    year: '2020',
    title: '品质认证',
    description: '通过ISO9001质量管理体系认证'
  }
]

onMounted(async () => {
  try {
    const response = await getPages()
    const aboutPage = response.data.find(page => page.slug === 'about')
    if (aboutPage) {
      aboutContent.value = aboutPage.content.rendered
    }
  } catch (error) {
    console.error('Failed to fetch about content:', error)
    aboutContent.value = '加载失败，请稍后重试'
  }
})
</script>

<style lang="scss" scoped>
.about {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  section {
    margin-bottom: 6rem;

    h1, h2 {
      text-align: center;
      color: #333;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    h2 {
      font-size: 2rem;
    }
  }

  .company-intro {
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }

      .intro-summary {
        background: #f8f8f8;
        padding: 2rem;
        border-radius: 8px;

        h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        p {
          color: #666;
          line-height: 1.8;
        }
      }
    }
  }

  .culture {
    .culture-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;

      .culture-item {
        text-align: center;
        padding: 2rem;
        background: #f8f8f8;
        border-radius: 8px;
        transition: transform 0.3s;

        &:hover {
          transform: translateY(-5px);
        }

        h3 {
          color: #1890ff;
          margin-bottom: 1rem;
        }

        p {
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }

  .history {
    .timeline {
      position: relative;
      padding: 2rem 0;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 100%;
        background: #eee;
      }

      .timeline-item {
        width: 50%;
        padding: 2rem;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: #1890ff;
          border-radius: 50%;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
        }

        &.right {
          margin-left: 50%;

          &::before {
            left: -10px;
          }

          .content {
            padding-left: 2rem;
          }
        }

        .content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);

          .year {
            display: inline-block;
            padding: 0.3rem 1rem;
            background: #1890ff;
            color: white;
            border-radius: 20px;
            margin-bottom: 1rem;
          }

          h3 {
            color: #333;
            margin-bottom: 0.5rem;
          }

          p {
            color: #666;
          }
        }
      }
    }
  }
}
</style> 