<template>
  <el-container class="admin-layout" v-loading="loading">
    <el-aside width="200px">
      <div class="admin-logo">
        <h3>SmartJob管理后台</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="admin-sidebar"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
        :unique-opened="true"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/admin/jobs">
          <el-icon><Briefcase /></el-icon>
          <span>岗位管理</span>
        </el-menu-item>
        <el-sub-menu index="/admin/system" v-if="isSuperAdmin">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/roles">
            <el-icon><Lock /></el-icon>
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/permissions">
            <el-icon><Key /></el-icon>
            <span>权限管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="admin-header-left">
          <h2>管理后台</h2>
        </div>
        <div class="admin-header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ currentUser.nickname || currentUser.phone || '管理员' }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">访问前台</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Odometer, Briefcase, ArrowDown, Setting, User, Lock, Key } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeMenu = ref('/admin/dashboard')
const currentUser = ref({})
const loading = ref(false)
const isSuperAdmin = ref(false)

// 监听路由变化，更新激活菜单项
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  }
)

onMounted(async () => {
  activeMenu.value = route.path
  await getCurrentUser()
  await checkUserRole()
  isSuperAdmin.value = authStore.isSuperAdmin()
})

const getCurrentUser = async () => {
  try {
    if (!authStore.user) {
      await authStore.fetchUserInfo()
    }
    if (authStore.user) {
      currentUser.value = authStore.user
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const checkUserRole = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // 检查用户角色是否为管理员
    const isAdmin = authStore.isAdmin()

    if (!isAdmin) {
      ElMessage.error('您没有权限访问管理后台')
      router.push('/')
    }
  } catch (error) {
    console.error('检查用户权限失败:', error)
    router.push('/admin/login')
  }
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      loading.value = true
      // 清除用户信息
      authStore.logout()
      ElMessage.success('退出登录成功')
      router.push('/admin/login')
    } catch (error) {
      console.error('退出登录失败:', error)
      ElMessage.error('退出登录失败')
    } finally {
      loading.value = false
    }
  } else if (command === 'home') {
    router.push('/')
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.admin-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b3a4d;
  color: #fff;
}

.admin-sidebar {
  height: calc(100% - 60px);
  border-right: none;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.admin-header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
}
</style>
