import axios from 'axios'
import client from './client'

const attachToken = (config: any) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

const handle401 = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }
  return Promise.reject(error)
}

axios.interceptors.request.use(attachToken)
axios.interceptors.response.use((res) => res, handle401)

client.interceptors.request.use(attachToken)
client.interceptors.response.use((res) => res, handle401)