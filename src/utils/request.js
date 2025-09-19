import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 使用环境变量配置API基础URL
  timeout: 5000, // 请求超时时间
  withCredentials: false // 新后端使用JWT认证，不需要cookie
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage中获取token（如果有）
    const token = localStorage.getItem('accessToken')
    if (token) {
      // 将token添加到请求头中
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 请求错误处理
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 后端API返回 {code, data, msg} 格式
    if (response.data && response.data.code === '200') {
      // 返回完整的响应数据，包括code、data、msg
      return response.data
    } else {
      // 如果code不是200，抛出错误
      return Promise.reject(new Error(response.data.msg || '请求失败'))
    }
  },
  (error) => {
    // 响应错误处理
    console.error('响应错误:', error)
    if (error.response && error.response.status === 401) {
      // token过期或未授权，清除本地token
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      // 跳转到登录页
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
