<template>
  <div class="production">
    <h1>研发生产</h1>
    
    <!-- 研发能力 -->
    <section class="section research">
      <h2>研发能力</h2>
      <div class="content-grid">
        <div class="text-content">
          <h3>先进的研发设施</h3>
          <p>我们拥有现代化的研发实验室和专业的研发团队，致力于新产品的开发和工艺改进。</p>
          <ul class="feature-list">
            <li>专业的研发团队</li>
            <li>先进的实验设备</li>
            <li>完善的研发体系</li>
            <li>丰富的研发经验</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 生产能力 -->
    <section class="section production-capability">
      <h2>生产能力</h2>
      <div class="content-grid">
        <div class="text-content">
          <h3>现代化生产线</h3>
          <p>公司拥有多条自动化生产线，严格执行质量管理体系，确保产品品质。</p>
          <ul class="feature-list">
            <li>自动化生产设备</li>
            <li>标准化生产流程</li>
            <li>严格的质量控制</li>
            <li>完善的仓储系统</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 质量控制 -->
    <section class="section quality-control">
      <h2>质量控制</h2>
      <div class="quality-grid">
        <div class="quality-item" v-for="(item, index) in qualityItems" :key="index">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const qualityItems = [
  {
    title: '原料检测',
    description: '严格的原材料进厂检验制度，确保原料品质。'
  },
  {
    title: '过程控制',
    description: '全程监控生产过程，确保工艺参数符合标准。'
  },
  {
    title: '成品检验',
    description: '完善的成品检验流程，保证产品质量。'
  },
  {
    title: '质量认证',
    description: '通过ISO9001等多项质量体系认证。'
  }
]
</script>

<style lang="scss" scoped>
.production {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    font-size: 2.5rem;
    color: #333;
    text-align: center;
    margin-bottom: 3rem;
  }

  .section {
    margin-bottom: 4rem;
    background: #f8f8f8;
    padding: 2rem;
    border-radius: 8px;

    h2 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }
  }

  .content-grid {
    .text-content {
      h3 {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 1rem;
      }

      p {
        color: #666;
        line-height: 1.8;
        margin-bottom: 1.5rem;
      }

      .feature-list {
        list-style: none;
        padding: 0;

        li {
          padding-left: 1.5rem;
          position: relative;
          margin-bottom: 0.5rem;
          color: #666;

          &::before {
            content: "✓";
            color: #1890ff;
            position: absolute;
            left: 0;
          }
        }
      }
    }
  }

  .quality-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;

    .quality-item {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      transition: transform 0.3s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      &:hover {
        transform: translateY(-5px);
      }

      h3 {
        font-size: 1.2rem;
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
</style> 