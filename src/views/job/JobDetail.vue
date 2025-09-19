<!-- frontend/src/views/JobDetail.vue -->
<template>
  <div class="job-detail-page">
    <NavBar />

    <div class="container flex-1">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="job-detail">
        <button class="back-btn" @click="$router.go(-1)">
          <i class="fas fa-arrow-left"></i> 返回列表
        </button>

        <div class="header">
          <h1>{{ job.title }}</h1>
          <div class="meta">
            <span class="company"> <i class="fas fa-building"></i> {{ job.company_name }} </span>
            <span class="location"> <i class="fas fa-map-marker-alt"></i> {{ job.location }} </span>
          </div>
          <div class="salary-type">
            <span class="salary">{{ job.salary }}</span>
            <span class="type">{{ job.job_type }}</span>
          </div>
        </div>

        <div class="content">
          <section class="description">
            <h3>职位描述</h3>
            <pre>{{ job.description }}</pre>
          </section>

          <aside class="company-info">
            <h3>公司信息</h3>
            <div class="info-item">
              <label>公司名称：</label>
              <span>{{ job.company_name }}</span>
            </div>
            <div class="info-item">
              <label>公司规模：</label>
              <span>{{ job.company_size }}</span>
            </div>
            <div class="info-item">
              <label>公司官网：</label>
              <a :href="job.url" class="website" target="_blank" rel="noopener">{{ job.url }}</a>
            </div>
          </aside>
        </div>

        <div class="actions">
          <button class="apply-btn" @click="applyForJob">
            <i class="fas fa-paper-plane"></i> 立即申请
          </button>
        </div>
      </div>
    </div>
    <div class="footer-container">
      <InfoFooter />
      <BottleFooter />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/layout/NavBar.vue'
import request from '@/utils/request'
import InfoFooter from '@/components/layout/InfoFooter.vue'
import BottleFooter from '@/components/layout/BottleFooter.vue'
export default {
  components: { NavBar, InfoFooter, BottleFooter },
  data() {
    return {
      job: null,
      loading: true,
      error: null
    }
  },
  computed: {
    jobId() {
      return this.$route.params.id
    }
  },
  async created() {
    // 检查是否已登录
    const token = localStorage.getItem('accessToken')
    if (!token) {
      this.error = '请先登录后再查看岗位详情'
      this.loading = false
      // 延迟跳转到登录页
      setTimeout(() => {
        this.$router.push('/login')
      }, 2000)
      return
    }

    try {
      const token = localStorage.getItem('accessToken')

      const respose = await request.get(`/jobs/${this.jobId}`)
      const jobData = respose.data
      // 新API直接返回岗位对象，无需额外的result.data嵌套
      this.job = {
        id: jobData.id,
        title: jobData.name, // 后端字段: name -> 前端: title
        company_name: jobData.companyName, // 后端字段: companyName -> 前端: company_name
        location: jobData.location,
        job_type: jobData.jobType, // 后端字段: jobType -> 前端: job_type
        salary: jobData.salary,
        description: jobData.description,
        company_size: jobData.companySize, // 后端字段: companySize -> 前端: company_size
        industry_field: jobData.tags, // 使用tags字段作为行业领域
        url: jobData.url
      }
    } catch (error) {
      this.error = '获取职位详情失败，请稍后重试'
      console.error('Error fetching job details:', error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    applyForJob() {
      // 在新标签页中打开job.url
      window.open(this.job.url, '_blank')
    }
  }
}
</script>

<style scoped>
.job-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  margin: 40px 5%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  position: relative;
}

.footer-container {
  margin-top: auto;
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  padding: 10px 0;
  margin-bottom: 20px;
}

.back-btn:hover {
  opacity: 0.8;
}

.header {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: var(--primary);
  margin-bottom: 15px;
}

.meta {
  display: flex;
  gap: 20px;
  color: #666;
  margin-bottom: 15px;
}

.salary-type {
  display: flex;
  gap: 15px;
  align-items: center;
}

.salary {
  color: var(--secondary);
  font-size: 1.2em;
  font-weight: bold;
}

.type {
  background: #e8f5e9;
  color: #43a047;
  padding: 5px 15px;
  border-radius: 15px;
}

.content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

.description {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.description pre {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #444;
  font-family: 'Helvetica Neue', Arial, 'Microsoft YaHei', sans-serif;
  margin: 0;
}

.company-info {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-item {
  margin-bottom: 15px;
}

.info-item label {
  font-weight: bold;
  color: #333;
}

.info-item span,
.info-item a {
  color: #666;
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

.website {
  color: #42b983;
}

.actions {
  text-align: center;
  margin: 40px 0;
}

.apply-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.apply-btn:hover {
  background: #3a9e72;
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
}

.error {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .job-detail-page {
    margin: 20px 3%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }

  .content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .meta {
    flex-direction: column;
    gap: 10px;
  }

  .salary-type {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .job-header {
    padding: 20px;
  }

  .job-title {
    font-size: 1.4rem;
  }

  .company-info {
    font-size: 1rem;
  }

  .salary-info {
    font-size: 1.1rem;
  }

  .meta-item {
    padding: 8px 0;
  }

  .meta-label {
    font-size: 0.9rem;
    min-width: 80px;
  }

  .meta-value {
    font-size: 0.9rem;
  }

  .description-section {
    padding: 20px;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .job-description {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .apply-btn,
  .back-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
