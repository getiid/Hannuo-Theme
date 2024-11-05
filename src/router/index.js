import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页 - 汉诺化工'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于我们 - 汉诺化工'
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/Products.vue'),
    meta: {
      title: '产品中心 - 汉诺化工'
    }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    meta: {
      title: '产品详情 - 汉诺化工'
    }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../views/News.vue'),
    meta: {
      title: '新闻中心 - 汉诺化工'
    }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('../views/NewsDetail.vue'),
    meta: {
      title: '新闻详情 - 汉诺化工'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    meta: {
      title: '联系我们 - 汉诺化工'
    }
  },
  {
    path: '/production',
    component: () => import('../views/Production.vue'),
    meta: {
      title: '研发生产 - 汉诺化工'
    },
    children: [
      {
        path: '',
        redirect: '/production/research'
      },
      {
        path: 'research',
        name: 'Research',
        component: () => import('../views/production/Research.vue'),
        meta: {
          title: '研发能力 - 汉诺化工'
        }
      },
      {
        path: 'equipment',
        name: 'Equipment',
        component: () => import('../views/production/Equipment.vue'),
        meta: {
          title: '生产设备 - 汉诺化工'
        }
      },
      {
        path: 'quality',
        name: 'Quality',
        component: () => import('../views/production/Quality.vue'),
        meta: {
          title: '质量控制 - 汉诺化工'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404 - 页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由标题处理
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '汉诺化工'
  next()
})

export default router 