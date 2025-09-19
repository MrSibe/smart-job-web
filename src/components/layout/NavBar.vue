<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="brand">
        <img src="@/assets/logo.png" alt="学院logo" class="logo">
        <span class="title">信息工程学院就业平台</span>
      </router-link>
      
      <div class="nav-items">
        <router-link 
          v-for="item in navLinks"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="active"
        >
          {{ item.text }}
        </router-link>
      </div>
      
      <div class="user-actions">
        <div v-if="isLoggedIn" class="user-info">
          <span class="welcome-text">欢迎，{{ username }}</span>
          <button class="logout-btn" @click="handleLogout">
            退出登录
          </button>
        </div>
        <div v-else class="auth-actions">
          <router-link to="/login" class="login-btn">
            登录
          </router-link>
          <router-link to="/register" class="register-btn">
            注册
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'NavBar',
  data() {
    return {
      navLinks: [
        { path: '/', text: '首页' },
        { path: '/jobs', text: '热招岗位' },
        { path: '/about', text: '关于我们' }
      ],
      isLoggedIn: false,
      username: ''
    }
  },
  mounted() {
    // 页面加载时检查登录状态
    this.checkLoginStatus()
  },
  methods: {
    async checkLoginStatus() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.isLoggedIn = true
        // 从Pinia store获取用户名
        const authStore = useAuthStore()
        if (authStore.user) {
          this.username = authStore.user.nickname || authStore.user.phone
        } else {
          // 如果store中没有用户信息，尝试获取
          try {
            await authStore.fetchUserInfo()
            if (authStore.user) {
              this.username = authStore.user.nickname || authStore.user.phone
            } else {
              this.username = '用户'
            }
          } catch (error) {
            console.error('获取用户信息失败:', error)
            this.username = '用户'
          }
        }
      }
    },

    async handleLogout() {
      const authStore = useAuthStore()
      // 清除用户信息
      authStore.logout()
      this.isLoggedIn = false
      this.username = ''

      // 跳转到首页
      this.$router.push('/')

      // 显示退出登录消息
      alert('已退出登录')
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #4A90E2;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
}

.logo {
  height: 40px;
}

.title {
  color: white;
  font-weight: 500;
  font-size: 1.2rem;
}

.nav-items {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #063f71;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.welcome-text {
  font-size: 0.9rem;
}

.logout-btn {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 5px 15px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.5);
}

.auth-actions {
  display: flex;
  gap: 10px;
}

.login-btn, .register-btn {
  color: white;
  text-decoration: none;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.login-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
}

.register-btn {
  background: #063f71;
  border: 1px solid #063f71;
}

.login-btn:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.5);
}

.register-btn:hover {
  background: #084a85;
  border-color: #084a85;
}

@media (max-width: 768px) {
  .nav-items {
    display: none;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>