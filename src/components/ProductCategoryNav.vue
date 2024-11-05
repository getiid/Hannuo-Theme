<template>
  <div class="category-nav">
    <div class="category-list">
      <div v-for="category in mainCategories" 
           :key="category.id" 
           class="category-item">
        <div class="main-category" 
             :class="{ active: isActive(category.id) }"
             @click="toggleCategory(category.id)">
          {{ category.name }}
          <span class="arrow" :class="{ open: openCategories.includes(category.id) }">▼</span>
        </div>
        
        <div class="sub-categories" 
             v-if="getSubCategories(category.id).length"
             :class="{ show: openCategories.includes(category.id) }">
          <router-link 
            v-for="subCat in getSubCategories(category.id)"
            :key="subCat.id"
            :to="`/products/category/${subCat.id}`"
            class="sub-category"
            :class="{ active: currentCategory === subCat.id }">
            {{ subCat.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import wpApi from '../services/wp-api'

export default {
  name: 'ProductCategoryNav',
  setup() {
    const route = useRoute()
    const categories = ref([])
    const openCategories = ref([])
    const currentCategory = ref(null)

    // 获取主分类（顶级分类）
    const mainCategories = computed(() => {
      return categories.value.filter(cat => cat.parent === 0)
    })

    // 获取子分类
    const getSubCategories = (parentId) => {
      return categories.value.filter(cat => cat.parent === parentId)
    }

    // 切换分类展开/收起
    const toggleCategory = (categoryId) => {
      const index = openCategories.value.indexOf(categoryId)
      if (index === -1) {
        openCategories.value.push(categoryId)
      } else {
        openCategories.value.splice(index, 1)
      }
    }

    // 检查分类是否激活
    const isActive = (categoryId) => {
      const category = categories.value.find(cat => cat.id === categoryId)
      if (!category) return false
      
      // 如果当前分类是主分类，检查是否有子分类被选中
      if (category.parent === 0) {
        return getSubCategories(categoryId).some(subCat => subCat.id === currentCategory.value)
      }
      return categoryId === currentCategory.value
    }

    // 获取分类数据
    const fetchCategories = async () => {
      try {
        const response = await wpApi.getProductCategories()
        categories.value = response
        
        // 如果路由中有分类ID，自动展开对应的父分类
        if (route.params.categoryId) {
          const category = categories.value.find(cat => cat.id === parseInt(route.params.categoryId))
          if (category && category.parent !== 0) {
            openCategories.value.push(category.parent)
          }
          currentCategory.value = parseInt(route.params.categoryId)
        }
      } catch (error) {
        console.error('获取产品分类失败:', error)
      }
    }

    onMounted(fetchCategories)

    watch(() => route.params.categoryId, (newId) => {
      if (newId) {
        currentCategory.value = parseInt(newId)
      }
    })

    return {
      mainCategories,
      openCategories,
      currentCategory,
      getSubCategories,
      toggleCategory,
      isActive
    }
  }
}
</script>

<style scoped>
.category-nav {
  width: 250px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 20px 0;
}

.category-item {
  margin-bottom: 5px;
}

.main-category {
  padding: 12px 20px;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.main-category:hover {
  background: #f8f9fa;
}

.main-category.active {
  color: #007bff;
  background: #f8f9fa;
}

.arrow {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.sub-categories {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.sub-categories.show {
  max-height: 500px;
}

.sub-category {
  display: block;
  padding: 10px 20px 10px 40px;
  color: #666;
  text-decoration: none;
  font-size: 0.95em;
  transition: all 0.3s ease;
}

.sub-category:hover {
  background: #f8f9fa;
  color: #007bff;
}

.sub-category.active {
  color: #007bff;
  background: #f8f9fa;
}
</style> 