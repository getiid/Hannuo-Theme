import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.hannuocm.com/wp-json/wp/v2'
})

export const getPages = () => api.get('/pages')
export const getPosts = () => api.get('/posts')
export const getProducts = () => api.get('/product') // 如果有自定义文章类型
export const getCategories = () => api.get('/categories') 