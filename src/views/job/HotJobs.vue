<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <NavBar />

    <div class="container">
      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索职位..."
          class="search-input"
          @keyup.enter="searchJobs"
        >
          <template #append>
            <el-button :icon="Search" @click="searchJobs" />
          </template>
        </el-input>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 左侧职位列表 -->
        <div class="job-list">
          <JobCard 
            v-for="job in displayedJobs"
            :key="job.id"
            :job="job"
          />
          
          <div v-if="displayedJobs.length === 0 && !isLoading" class="empty-tip">
            <i class="fas fa-search"></i>
            <p>没有找到符合条件的职位</p>
          </div>
          
          <!-- 分页组件 -->
          <div class="pagination-wrapper" v-if="totalPages > 1">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="totalJobs"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              @current-change="handlePageChange"
              background
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      加载中...
    </div>

    <!-- 添加底部组件 -->
    <div class="footer-container">
      <InfoFooter />
      <BottleFooter />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import NavBar from '@/components/layout/NavBar.vue'
import JobCard from '@/components/job/JobCard.vue'
import InfoFooter from "@/components/layout/InfoFooter.vue";
import BottleFooter from "@/components/layout/BottleFooter.vue";
import request from '@/utils/request';

export default {
  name: 'HotJobs',
  components: {BottleFooter, NavBar, JobCard, InfoFooter },
  setup() {
    const searchQuery = ref('')
    const isLoading = ref(false)
    
    const jobs = ref([])
    
    // 分页相关数据
    const currentPage = ref(1)
    const pageSize = ref(15)
    const totalJobs = ref(0)
    const totalPages = ref(0)
    
    const filteredJobs = computed(() => {
      const search = searchQuery.value.toLowerCase();
      return jobs.value.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search)
      );
    })
    
    const displayedJobs = computed(() => {
      // 如果有搜索查询，则显示所有匹配的结果，不分页
      if (searchQuery.value) {
        return filteredJobs.value;
      }
      
      // 如果是分页查询，直接返回从后端获取的数据
      return jobs.value;
    })
    
    const loadJobs = async () => {
      try {
        isLoading.value = true;
        const response = await request.get(`/jobs?page=${currentPage.value}&size=${pageSize.value}`);

        if (response.data && response.data.records) {
          // 映射后端字段到前端字段
          jobs.value = response.data.records.map(job => ({
            id: job.id,
            title: job.name,
            company: job.companyName,
            location: job.location,
            job_type: job.jobType,
            salary: job.salary,
            description: job.description
          }));

          // 设置分页信息
          totalJobs.value = response.data.total;
          totalPages.value = response.data.pages;
        } else {
          console.error('获取岗位列表失败:', response.msg);
        }
      } catch (error) {
        console.error('数据加载失败:', error);
      } finally {
        isLoading.value = false;
      }
    }
    
    const handlePageChange = async (page) => {
      currentPage.value = page;
      await loadJobs();
    }
    
    const searchJobs = () => {
      // 搜索时重置到第一页
      currentPage.value = 1;
      // 搜索逻辑已通过计算属性自动处理
    }
    
    onMounted(async () => {
      await loadJobs();
    })
    
    return {
      searchQuery,
      isLoading,
      jobs,
      currentPage,
      pageSize,
      totalJobs,
      totalPages,
      displayedJobs,
      Search,
      loadJobs,
      handlePageChange,
      searchJobs
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  margin: 40px 5%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.container {
  flex: 1;
  width: 100%;
  padding: 0 30px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-top: 30px;
  width: 100%;
}

.search-box {
  display: flex;
  gap: 15px;
  margin: 30px 0;
  width: 100%;
}

:deep(.search-input .el-input-group__append) {
  background: #42b983;
  border-color: #42b983;
  color: white;
  border-radius: 0 30px 30px 0;
}

:deep(.search-input .el-button) {
  color: white;
}

.search-input {
  flex: 1;
  padding: 12px 25px;
  border: 2px solid #e0e0e0;
  border-radius: 30px;
  font-size: 16px;
}

.search-input:focus {
  border-color: #42b983;
  outline: none;
}

.job-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.job-card {
  justify-self: stretch;
}

.job-card :deep(.job-card) {
  height: 100%;
  width: 100%;
}

.empty-tip {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  grid-column: 1 / -1; /* 跨越所有列 */
}

.empty-tip i {
  font-size: 3rem;
  margin-bottom: 20px;
  display: block;
  color: #ddd;
}

.loading {
  text-align: center;
  padding: 30px;
  color: #42b983;
}

.pagination-wrapper {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 30px 0;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .notice-board {
    order: -1;
  }
  
  .job-list {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 15px;
  }
}

@media (max-width: 1200px) {
  .job-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .job-list {
    grid-template-columns: 1fr;
  }
}
</style>