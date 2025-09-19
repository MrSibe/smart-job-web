<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-header">
        <h2>管理端登录</h2>
        <p>请输入您的手机号和密码</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号" size="large" clearable>
            <template #prefix>
              <el-icon><Iphone /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Iphone, Lock } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const loginFormRef = ref()
const authStore = useAuthStore()

// 登录表单数据
const loginForm = reactive({
  phone: '',
  password: ''
})

// 登录表单验证规则
const loginRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 登录加载状态
const loading = ref(false)

// 处理登录
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()

    loading.value = true

    // 发送登录请求
    const response = await request.post('/auth/login', loginForm)

    if (response.code === '200') {
      // 保存JWT token
      localStorage.setItem('accessToken', response.data.accessToken)

      // 获取用户信息并存储到Pinia
      const userInfo = await authStore.fetchUserInfo()

      if (userInfo) {
        // 检查用户角色是否为管理员
        const isAdmin = authStore.isAdmin()

        if (isAdmin) {
          ElMessage.success('登录成功')
          // 登录成功后跳转到管理后台首页
          router.push('/admin/dashboard')
        } else {
          ElMessage.error('您没有管理员权限')
          // 清除token和用户信息
          authStore.logout()
        }
      } else {
        ElMessage.error('获取用户信息失败')
      }
    } else {
      ElMessage.error(response.msg || '登录失败')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查网络或联系管理员')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
}

.login-form {
  margin-top: 30px;
}

.login-button {
  margin-top: 20px;
}
</style>
