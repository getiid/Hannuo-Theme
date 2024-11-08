# 汉诺化工官网项目

## 项目简介
这是一个基于 WordPress + Vue.js 的混合开发项目，前端使用 Vue.js 构建单页应用，后端使用 WordPress 作为内容管理系统和 API 服务。

## 技术栈
- 前端：Vue 3 + Vite
- 后端：WordPress
- API：WordPress REST API
- 数据管理：Advanced Custom Fields (ACF)
- 地图：OpenStreetMap
- 包管理：npm

## 项目结构
```
chemical-web/
├── src/                        # Vue源代码目录
│   ├── components/            # 公共组件
│   │   ├── PageTitle.vue     # 页面标题组件
│   │   ├── TheHeader.vue     # 头部导航组件
│   │   └── TheFooter.vue     # 页脚组件
│   ├── views/                # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── About.vue        # 关于我们
│   │   ├── about/           # 关于我们子页面
│   │   │   ├── CompanyIntro.vue    # 企业介绍
│   │   │   ├── CompanyCulture.vue  # 企业文化
│   │   │   └── History.vue         # 发展历程
│   │   ├─�� Production.vue   # 研发生产
│   │   ├── ProductsPage.vue # 产品中心
│   │   ├── ProductDetails.vue # 产品详情
│   │   ├── NewsPage.vue     # 资讯中心
│   │   ├── NewsDetail.vue   # 资讯详情
│   │   └── ContactPage.vue  # 联系我们
│   ├── router/              # 路由配置
│   ├── services/            # API服务
│   ├── assets/              # 静态资源
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── public/                  # 公共资源目录
├── wordpress/              # WordPress主题文件
│   ├── functions.php       # 主题函数
│   ├── index.php          # 主页模板
│   ├── header.php         # 头部模板
│   ├── footer.php         # 页脚模板
│   └── style.css          # 主题样式
└── build-theme.sh         # 主题构建脚本
```

## 功能特性
1. **首页**
   - Banner轮播
   - 企业特色展示
   - 公司简介
   - 产品分类展示
   - 最新资讯

2. **关于我们**
   - 企业介绍
   - 企业文化
   - 发展历程

3. **研发生产**
   - 研发能力
   - 生产设备
   - 质量控制

4. **产品中心**
   - 产品分类（一级、二级）
   - 产品搜索（支持产品名称和CAS号）
   - 产品详情展示

5. **资讯中心**
   - 新闻列表
   - 新闻详情
   - 分页功能

6. **联系我们**
   - 公司信息展示
   - 地图定位

## 安装部署
1. 安装依赖
```bash
npm install
```

2. 开发环境运行
```bash
npm run dev
```

3. 生产环境构建
```bash
npm run build
```

4. 构建WordPress主题
```bash
./build-theme.sh
```

## WordPress配置要求
- WordPress 5.0+
- PHP 7.4+
- 必需插件：
  - Advanced Custom Fields PRO
  - WP REST API
  - WP REST Cache
  - CORS Enabler

## ACF字段配置
项目包含以下ACF字段组：
1. 站点设置
   - 页脚二维码
   - 页面标题背景图
   - 公司信息

2. 首页设置
   - Banner设置
   - 特色板块
   - 产品分类展示

3. 产品字段
   - CAS号
   - 包装规格
   - 产品详情

4. 企业文化
   - 企业使命
   - 企业愿景
   - 核心价值观

## 开发注意事项
1. API安全性
2. 跨域配置
3. 图片优化
4. 移动端适配
5. SEO优化

## 维护更新
1. 内容更新通过WordPress后台管理
2. 功能更新需要重新构建主题
3. 定期检查插件更新

## 贡献指南
1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 发起 Pull Request

## 许可证
GPL v2 或更高版本

## Vue 项目说明

### 组件结构
```
src/
├── components/              # 公共组件
│   ├── PageTitle.vue       # 页面标题组件（带背景图）
│   ├── TheHeader.vue       # 全局头部导航组件
│   └── TheFooter.vue       # 全局页脚组件
└── views/                  # 页面组件
    ├── Home.vue           # 首页
    ├── About.vue          # 关于我们（父组件）
    ├── about/             # 关于我们子页面
    │   ├── CompanyIntro.vue    # 企业介绍
    │   ├── CompanyCulture.vue  # 企业文化
    │   └── History.vue         # 发展历程
    ├── Production.vue     # 研发生产
    ├── ProductsPage.vue   # 产品中心
    ├── ProductDetails.vue # 产品详情
    ├── NewsPage.vue       # 资讯中心
    ├── NewsDetail.vue     # 资讯详情
    └── ContactPage.vue    # 联系我们
```

### 主要依赖
```json
{
  "dependencies": {
    "vue": "^3.0.0",
    "vue-router": "^4.0.0",
    "axios": "^0.21.1",
    "swiper": "^8.0.0",
    "leaflet": "^1.7.1"
  }
}
```

### API 服务
- `src/services/wp-api.js`: WordPress REST API 封装
- 主要接口：
  - `/wp/v2/pages`: 页面数据
  - `/wp/v2/posts`: 新闻文章
  - `/wp/v2/products`: 产品数据
  - `/wp/v2/product_category`: 产品分类
  - `/wp/v2/site-settings`: 站点设置
  - `/wp/v2/product-search`: 产品搜索

### 路由配置
```javascript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    component: About,
    children: [
      {
        path: 'intro',
        name: 'CompanyIntro',
        component: CompanyIntro
      },
      {
        path: 'culture',
        name: 'CompanyCulture',
        component: CompanyCulture
      },
      {
        path: 'history',
        name: 'History',
        component: History
      }
    ]
  }
  // ... 其他路由
]
```

### 主要功能实现

1. **页面标题组件 (PageTitle.vue)**
   - 支持自定义背景图
   - 中英文标题显示
   - 响应式设计

2. **导航组件 (TheHeader.vue)**
   - 响应式菜单
   - 移动端汉堡菜单
   - 滚动时固定顶部

3. **产品中心 (ProductsPage.vue)**
   - 产品分类导航
   - 产品搜索（支持名称和CAS号）
   - 分页功能
   - 响应式表格

4. **新闻中心 (NewsPage.vue)**
   - 新闻列表展示
   - 分页功能
   - 日期格式化

5. **联系我们 (ContactPage.vue)**
   - OpenStreetMap 地图集成
   - 联系信息展示

6. **首页 (Home.vue)**
   - Swiper 轮播
   - 产品分类展示
   - 最新资讯

### 数据管理
- 使用 Vue3 的 Composition API
- 页面级组件使用 Options API
- ACF 字段映射到前端组件

### 样式管理
- 使用 Scoped CSS
- 主题色：rgb(43,75,118)
- 响应式断点：
  - 移动端：768px
  - 平板：1024px
  - 桌面：1200px

### 开发规范
1. **命名规范**
   - 组件名：PascalCase
   - 方法名：camelCase
   - 样式类名：kebab-case

2. **代码组织**
   - 组件按功能模块分组
   - 公共组件放在 components 目录
   - 页面组件放在 views 目录

3. **注释规范**
   - 组件顶部必须有功能说明
   - 复杂方法需要添加注释
   - API 调用需要注明数据结构

4. **Git 提交规范**
   - feat: 新功能
   - fix: 修复bug
   - docs: 文档更新
   - style: 代码格式
   - refactor: 重构

### 性能优化
1. 图片懒加载
2. 路由懒加载
3. 组件按需加载
4. API 数据缓存
5. 静态资源压缩

### 调试工具
- Vue DevTools
- 浏览器开发者工具
- WordPress Debug 模式
