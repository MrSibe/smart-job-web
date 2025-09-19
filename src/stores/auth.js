import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

export const useAuthStore = defineStore('auth', () => {
  // 用户信息
  const user = ref(null)
  // 权限列表
  const permissions = ref([])
  // 角色列表
  const roles = ref([])
  // 是否已加载用户信息
  const isUserInfoLoaded = ref(false)

  // 获取当前用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await request.get('/users/me')
      if (response.code === '200') {
        user.value = response.data
        permissions.value = response.data.permissions || []
        roles.value = response.data.roles || []
        isUserInfoLoaded.value = true
        return response.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      isUserInfoLoaded.value = true
      return null
    }
  }

  // 检查是否有指定权限
  const hasPermission = (permission) => {
    return permissions.value.includes(permission)
  }

  // 检查是否有任一权限
  const hasAnyPermission = (permissionList) => {
    return permissionList.some(perm => permissions.value.includes(perm))
  }

  // 检查是否有所有权限
  const hasAllPermissions = (permissionList) => {
    return permissionList.every(perm => permissions.value.includes(perm))
  }

  // 检查是否有指定角色
  const hasRole = (role) => {
    return roles.value.includes(role)
  }

  // 检查是否有任一角色
  const hasAnyRole = (roleList) => {
    return roleList.some(role => roles.value.includes(role))
  }

  // 检查是否是管理员
  const isAdmin = () => {
    return hasAnyRole(['super_admin', 'sys_admin'])
  }

  // 检查是否是超级管理员
  const isSuperAdmin = () => {
    return hasRole('super_admin')
  }

  // 清除用户信息
  const clearUserInfo = () => {
    user.value = null
    permissions.value = []
    roles.value = []
    isUserInfoLoaded.value = false
  }

  // 退出登录
  const logout = () => {
    localStorage.removeItem('accessToken')
    clearUserInfo()
  }

  return {
    user,
    permissions,
    roles,
    isUserInfoLoaded,
    fetchUserInfo,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    clearUserInfo,
    logout
  }
})