import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.hannuocm.com/wp-json/wp/v2'
})

// 获取产品列表 (使用自定义文章类型)
export const getProducts = () => api.get('/product?_embed')

// 获取新闻列表
export const getNews = () => api.get('/posts?_embed')

// 获取页面内容
export const getPage = (slug) => api.get(`/pages?slug=${slug}&_embed`)

// 获取分类
export const getCategories = () => api.get('/categories')

// 获取媒体文件
export const getMedia = (id) => api.get(`/media/${id}`)