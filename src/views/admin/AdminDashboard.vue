<template>
  <div class="dashboard">
    <el-card class="statistic-card">
      <template #header>
        <div class="card-header">
          <span>数据统计</span>
        </div>
      </template>

      <div class="statistic-container">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="statistic-item" shadow="hover">
              <div class="statistic-content">
                <div class="statistic-icon jobs">
                  <el-icon><Briefcase /></el-icon>
                </div>
                <div class="statistic-info">
                  <div class="statistic-value">{{ jobCount }}</div>
                  <div class="statistic-label">岗位总数</div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="statistic-item" shadow="hover">
              <div class="statistic-content">
                <div class="statistic-icon users">
                  <el-icon><User /></el-icon>
                </div>
                <div class="statistic-info">
                  <div class="statistic-value">{{ userCount }}</div>
                  <div class="statistic-label">用户总数</div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="statistic-item" shadow="hover">
              <div class="statistic-content">
                <div class="statistic-icon roles">
                  <el-icon><UserFilled /></el-icon>
                </div>
                <div class="statistic-info">
                  <div class="statistic-value">{{ roleCount }}</div>
                  <div class="statistic-label">角色总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="recent-card">
      <template #header>
        <div class="card-header">
          <span>最近活动</span>
        </div>
      </template>

      <div class="recent-container">
        <el-empty v-if="recentActivities.length === 0" description="暂无活动记录" />
        <el-timeline v-else>
          <el-timeline-item
            v-for="(activity, index) in recentActivities"
            :key="index"
            :timestamp="activity.timestamp"
            placement="top"
          >
            <el-card>
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.content }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElCard, ElRow, ElCol, ElIcon, ElEmpty, ElTimeline, ElTimelineItem } from 'element-plus'
import { Briefcase, User, UserFilled } from '@element-plus/icons-vue'
import request from '@/utils/request'

// 数据统计
const jobCount = ref(0)
const userCount = ref(0)
const roleCount = ref(0)

// 最近活动
const recentActivities = ref([])

onMounted(() => {
  fetchStatistics()
  fetchRecentActivities()
})

const fetchStatistics = async () => {
  try {
    // 获取岗位数量
    const jobResponse = await request.get('/admin/job/count')
    if (jobResponse.code === '200') {
      jobCount.value = jobResponse.data
    }

    // 获取用户数量
    const userResponse = await request.get('/admin/user/count')
    if (userResponse.code === '200') {
      userCount.value = userResponse.data
    }

    // 获取角色数量
    const roleResponse = await request.get('/admin/role/count')
    if (roleResponse.code === '200') {
      roleCount.value = roleResponse.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const fetchRecentActivities = async () => {
  try {
    // 模拟最近活动数据
    recentActivities.value = [
      {
        timestamp: '2023-01-01 10:00',
        title: '新增岗位',
        content: '新增了Java开发工程师岗位'
      },
      {
        timestamp: '2023-01-02 14:30',
        title: '用户注册',
        content: '新用户张三注册了系统'
      },
      {
        timestamp: '2023-01-03 09:15',
        title: '岗位更新',
        content: '更新了前端开发工程师岗位信息'
      }
    ]
  } catch (error) {
    console.error('获取最近活动失败:', error)
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.statistic-card,
.recent-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.statistic-container {
  padding: 20px 0;
}

.statistic-item {
  border-radius: 8px;
}

.statistic-content {
  display: flex;
  align-items: center;
}

.statistic-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
}

.statistic-icon.jobs {
  background-color: #e6f7ff;
  color: #1890ff;
}

.statistic-icon.users {
  background-color: #f9f0ff;
  color: #722ed1;
}

.statistic-icon.roles {
  background-color: #fff0f0;
  color: #ff4d4f;
}

.statistic-info {
  flex: 1;
}

.statistic-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.statistic-label {
  color: #666;
  font-size: 14px;
}

.recent-container {
  padding: 20px 0;
}
</style>
