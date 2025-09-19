import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import HotJobs from '@/views/job/HotJobs.vue'
import JobDetail from '@/views/job/JobDetail.vue'

// 管理端页面
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminJobList from '@/views/admin/AdminJobList.vue'
import AdminUserList from '@/views/admin/AdminUserList.vue'
import AdminRoleList from '@/views/admin/AdminRoleList.vue'
import AdminPermissionList from '@/views/admin/AdminPermissionList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/jobs/:id',
    name: 'JobDetail',
    component: JobDetail
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: HotJobs
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  // 管理端路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'jobs',
        name: 'AdminJobs',
        component: AdminJobList
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUserList
      },
      {
        path: 'roles',
        name: 'AdminRoles',
        component: AdminRoleList
      },
      {
        path: 'permissions',
        name: 'AdminPermissions',
        component: AdminPermissionList
      },
      // 默认重定向到仪表盘
      {
        path: '',
        redirect: 'dashboard'
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('accessToken')

  // 检查是否访问管理端页面
  if (to.path.startsWith('/admin') && !to.path.startsWith('/admin/login')) {
    if (!token) {
      // 没有token，重定向到管理端登录页
      next('/admin/login')
    } else {
      // 有token，允许访问
      next()
    }
  } else if (to.path.startsWith('/jobs/') && to.name === 'JobDetail') {
    // 检查是否访问岗位详情页面
    // 岗位详情需要登录且有job:detail权限，由后端API控制
    next()
  } else {
    // 其他页面，直接访问
    next()
  }
})

export default router