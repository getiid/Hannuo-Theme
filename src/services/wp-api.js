import axios from 'axios';
import { WP_API_CONFIG } from '../config/api';

// 创建axios实例
const apiClient = axios.create({
    baseURL: import.meta.env.DEV ? '/wp-json' : `${WP_API_CONFIG.BASE_URL}`,
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: false
});

const wpApi = {
    // 获取文章列表
    async getPosts(page = 1, perPage = 10) {
        try {
            console.log('Fetching posts, page:', page);
            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.POSTS}`, {
                params: {
                    page,
                    per_page: perPage,
                    _embed: true  // 获取关联数据
                }
            });
            
            console.log('Posts response:', response);
            
            if (response.data) {
                // 处理返回的数据
                const posts = response.data.map(post => ({
                    ...post,
                    featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                    categories_info: post._embedded?.['wp:term']?.[0] || []
                }));
                
                console.log('Processed posts:', posts);
                return posts;
            }
            
            return [];
        } catch (error) {
            console.error('获取文章列表失败:', error);
            if (error.response?.status === 404) {
                return []; // 没有文章时返回空数组
            }
            throw error;
        }
    },

    // 获取产品列表
    async getProducts(page = 1, perPage = 10) {
        try {
            const response = await axios.get(`${WP_API_CONFIG.BASE_URL}${WP_API_CONFIG.ENDPOINTS.PRODUCTS}`, {
                params: {
                    page,
                    per_page: perPage
                }
            });
            return response.data;
        } catch (error) {
            console.error('获取产品列表失败:', error);
            throw error;
        }
    },

    // 获取特色产品
    async getFeaturedProducts() {
        try {
            const response = await axios.get(`${WP_API_CONFIG.BASE_URL}${WP_API_CONFIG.ENDPOINTS.FEATURED_PRODUCTS}`);
            return response.data;
        } catch (error) {
            console.error('获取特色产品失败:', error);
            throw error;
        }
    },

    // 获取联系页面信息
    async getContactInfo() {
        try {
            console.log('Fetching contact page data...');
            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.PAGES}`, {
                params: {
                    slug: 'contact'
                }
            });
            
            console.log('API Response:', response);
            
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const pageData = response.data[0];
                return {
                    company_name: pageData.company_name,
                    address: pageData.address,
                    phone: pageData.phone,
                    email: pageData.email,
                    map_coordinates: pageData.map_coordinates,
                    working_hours: pageData.working_hours || [],
                    social_media: pageData.social_media || []
                };
            }
            throw new Error('未找到联系我们页面数据');
        } catch (error) {
            console.error('API Error:', error);
            if (error.response) {
                // 服务器响应错误
                throw new Error(`服务器错误: ${error.response.status}`);
            } else if (error.request) {
                // 请求发送失败
                throw new Error('网络连接失败，请检查网络设置');
            } else {
                // 其他错误
                throw new Error(error.message);
            }
        }
    },

    // 提交联系表单
    async submitContactForm(formData) {
        try {
            const response = await axios.post(`${WP_API_CONFIG.BASE_URL}${WP_API_CONFIG.ENDPOINTS.CONTACT_FORM}`, formData);
            return response.data;
        } catch (error) {
            console.error('提交表单失败:', error);
            throw error;
        }
    },

    // 获取首页数据
    async getHomeData() {
        try {
            console.log('Fetching home page data...');
            const response = await axios.get(`${WP_API_CONFIG.BASE_URL}${WP_API_CONFIG.ENDPOINTS.PAGES}`, {
                params: {
                    slug: 'home'
                }
            });
            console.log('Full API response:', response.data);
            
            if (response.data && response.data.length > 0) {
                const pageData = response.data[0];
                console.log('Home page found:', pageData);
                // 返回ACF字段数据
                return pageData.acf || {};
            }
            console.error('Home page not found in response');
            throw new Error('Home page not found');
        } catch (error) {
            console.error('Error details:', error.response || error);
            throw error;
        }
    },

    // 获取研发生产数据
    async getProductionData() {
        try {
            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.PAGES}`, {
                params: {
                    slug: 'production'
                }
            });
            
            if (response.data && response.data.length > 0) {
                return response.data[0].acf;
            }
            throw new Error('未找到研发生产页面数据');
        } catch (error) {
            console.error('获取研发生产数据失败:', error);
            throw error;
        }
    }
};

export default wpApi; 