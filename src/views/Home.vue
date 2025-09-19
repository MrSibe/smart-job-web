<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <NavBar />

    <div class="container">


      <!-- 主内容区 -->
      <div class="main-content">

        <!-- 左侧职位列表 -->
        <div class="job-list">
          <!-- 标题和按钮 -->
          <div class="header-section">
            <h2 class="section-title">最新岗位</h2>
            <router-link to="/jobs" class="view-all-btn">
              查看全部岗位
            </router-link>
          </div>
          <JobCard 
            v-for="job in displayedJobs"
            :key="job.id"
            :job="job"
          />
          
          <div v-if="displayedJobs.length === 0 && !isLoading" class="empty-tip">
            <i class="fas fa-search"></i>
            <p>没有找到符合条件的职位</p>
          </div>
          
        </div>

        <!-- 右侧学院通知 -->
        <div class="notice-board">
          <h3 class="board-title"><i class="fas fa-bullhorn"></i> 学院通知</h3>
          <div class="notice-list">
            <div v-for="notice in notices" :key="notice.title" class="notice-item">
              <div class="notice-header">
                <span class="notice-title">{{ notice.title }}</span>
                <span class="notice-date">{{ notice.date }}</span>
              </div>
              <p class="notice-content">{{ notice.content }}</p>
              <a :href="notice.link" class="notice-link">查看详情</a>
            </div>
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
  name: 'HomePage',
  components: {BottleFooter, NavBar, JobCard, InfoFooter },
  setup() {
    const searchQuery = ref('')
    const isLoading = ref(false)
    
    const jobs = ref([])
    const notices = reactive([
      {
        title: '关于开展2025届毕业实习的通知',
        date: '2024-3-25',
        content: '根据教学计划安排，2025届毕业生实习工作将于...',
        link: 'https://xxgc.sicau.edu.cn/info/1040/1051.htm'
      },
      {
        title: '创新大赛院内选拔赛报名通知',
        date: '2024-3-20',
        content: '中国国际大学生创新大赛院内选拔赛将于...',
        link: 'https://xxgc.sicau.edu.cn/info/1040/1051.htm'
      }
    ])
    
    
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
      
      // 默认只显示前5个岗位
      return jobs.value.slice(0, 5);
    })
    
    const loadJobs = async () => {
      try {
        isLoading.value = true;
        // 使用新的API端点，加载5个岗位
        const response = await request.get('/jobs?page=1&size=5');

        jobs.value = response.data.records.map(job => ({
          id: job.id,
          title: job.name,           // 后端字段: name -> 前端: title
          company: job.companyName,  // 后端字段: companyName -> 前端: company
          location: job.location,
          job_type: job.jobType,     // 后端字段: jobType -> 前端: job_type
          salary: job.salary,
          description: job.description
        }));
        
      } catch (error) {
        console.error('数据加载失败:', error);
      } finally {
        isLoading.value = false;
      }
    }
    
    const searchJobs = () => {
      // 搜索时仍然使用所有数据进行搜索
      // 搜索逻辑已通过计算属性自动处理
    }
    
    onMounted(async () => {
      await loadJobs();
    })
    
    return {
      searchQuery,
      isLoading,
      jobs,
      notices,
      displayedJobs,
      Search,
      loadJobs,
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

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

.search-box {
  display: flex;
  gap: 15px;
  margin: 30px 0;
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
  gap: 20px;
}

.notice-board {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.board-title {
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
}

.board-title i {
  margin-right: 10px;
  color: #42b983;
}

.notice-list {
  display: grid;
  gap: 25px;
}

.notice-item {
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fa;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.notice-title {
  font-weight: 600;
  color: #2c3e50;
}

.notice-date {
  color: #7f8c8d;
  font-size: 0.9em;
}

.notice-content {
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
}

.notice-link {
  color: #42b983;
  text-decoration: none;
  font-size: 0.9em;
}

.notice-link:hover {
  text-decoration: underline;
}

.empty-tip {
  text-align: center;
  padding: 60px 20px;
  color: #999;
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-left: 10px; /* 添加左边距 */
}

.section-title {
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
}

.view-all-btn {
  background-color: #42b983;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.view-all-btn:hover {
  background-color: #359c6d;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .notice-board {
    order: -1;
  }
}
</style>