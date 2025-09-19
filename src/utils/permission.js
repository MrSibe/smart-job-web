import request from './request'

// 权限缓存
let userPermissions = null
let userRoles = null

// 获取当前用户权限
const getCurrentUserPermissions = async () => {
  if (userPermissions) {
    return userPermissions
  }

  try {
    const response = await request.get('/users/me')
    if (response.code === '200') {
      userPermissions = response.data.permissions || []
      userRoles = response.data.roles || []
      return userPermissions
    }
  } catch (error) {
    console.error('获取用户权限失败:', error)
    return []
  }
  return []
}

// 检查是否有指定权限
const hasPermission = async (permission) => {
  const permissions = await getCurrentUserPermissions()
  return permissions.includes(permission)
}

// 检查是否有任一权限
const hasAnyPermission = async (permissions) => {
  const userPerms = await getCurrentUserPermissions()
  return permissions.some((perm) => userPerms.includes(perm))
}

// 检查是否有所有权限
const hasAllPermissions = async (permissions) => {
  const userPerms = await getCurrentUserPermissions()
  return permissions.every((perm) => userPerms.includes(perm))
}

// 检查是否有指定角色
const hasRole = async (role) => {
  if (!userRoles) {
    await getCurrentUserPermissions()
  }
  return userRoles.includes(role)
}

// 检查是否有任一角色
const hasAnyRole = async (roles) => {
  if (!userRoles) {
    await getCurrentUserPermissions()
  }
  return roles.some((role) => userRoles.includes(role))
}

// 清除权限缓存
const clearPermissionCache = () => {
  userPermissions = null
  userRoles = null
}

export {
  getCurrentUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  clearPermissionCache
}
