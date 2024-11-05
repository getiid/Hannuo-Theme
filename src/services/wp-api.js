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
    async getProducts(page = 1, perPage = 10, categoryId = null) {
        try {
            const params = {
                page,
                per_page: perPage,
                _embed: true
            };

            // 如果有分类ID，添加到参数中
            if (categoryId) {
                params.product_category = categoryId;
            }

            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.PRODUCTS}`, {
                params
            });

            if (response.data) {
                // 处理返回的数据
                const products = response.data.map(product => ({
                    ...product,
                    featured_image: product._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                    categories: product._embedded?.['wp:term']?.[0] || []
                }));
                
                return products;
            }
            
            return [];
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
            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.PAGES}`, {
                params: {
                    slug: 'home'
                }
            });
            
            // 获取最新新闻
            const latestNews = await this.getPosts(1, 3);
            
            // 获取关于我们页面数据
            const aboutResponse = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.PAGES}`, {
                params: {
                    slug: 'about'
                }
            });
            
            const aboutData = aboutResponse.data && aboutResponse.data.length > 0 
                ? aboutResponse.data[0].acf?.company_intro 
                : null;
            
            if (response.data && response.data.length > 0) {
                const pageData = response.data[0];
                console.log('Home page data:', pageData);
                
                // 组合所有需要的数据
                return {
                    banner: pageData.acf?.banner || [],
                    features: pageData.acf?.features || [],
                    about: aboutData,
                    product_categories: pageData.acf?.product_categories || {
                        amino_acids: {},
                        reagents: {}
                    },
                    latest_news: latestNews || []
                };
            }
            throw new Error('Home page not found');
        } catch (error) {
            console.error('Error fetching home page data:', error);
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
    },

    // 获取单篇文章
    async getPost(id) {
        try {
            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.POSTS}/${id}`, {
                params: {
                    _embed: true
                }
            });
            
            if (response.data) {
                // 处理返回的数据
                return {
                    ...response.data,
                    featured_image: response.data._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                    categories_info: response.data._embedded?.['wp:term']?.[0] || []
                };
            }
            throw new Error('文章不存在');
        } catch (error) {
            console.error('获取文章详情失败:', error);
            throw error;
        }
    },

    // 获取产品详情
    async getProduct(id) {
        try {
            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, {
                params: {
                    _embed: true
                }
            });
            
            if (response.data) {
                // 处理返回的数据
                return {
                    ...response.data,
                    categories: response.data._embedded?.['wp:term']?.[0] || []
                };
            }
            throw new Error('产品不存在');
        } catch (error) {
            console.error('获取产品详情失败:', error);
            throw error;
        }
    },

    // 获取产品分类
    async getProductCategories() {
        try {
            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.PRODUCT_CATEGORIES}`);
            return response.data;
        } catch (error) {
            console.error('获取产品分类失败:', error);
            return [];
        }
    },

    // 获取关于我们页面数据
    async getAboutData() {
        try {
            console.log('Fetching about page data...');
            const response = await apiClient.get(`${WP_API_CONFIG.ENDPOINTS.PAGES}`, {
                params: {
                    slug: 'about'
                }
            });
            
            console.log('About page response:', response);
            
            if (response.data && response.data.length > 0) {
                const pageData = response.data[0];
                console.log('About page raw data:', pageData);
                
                // 返回新的字段结构
                return {
                    company_intro: pageData.company_intro || {
                        description: '',
                        business_license: '',
                        advantages: []
                    },
                    company_culture: pageData.company_culture || {
                        mission: '',
                        vision: '',
                        core_values: []
                    },
                    history: pageData.history || []
                };
            }
            throw new Error('未找到关于我们页面数据');
        } catch (error) {
            console.error('获取关于我们数据失败:', error);
            throw error;
        }
    }
};

export default wpApi; 