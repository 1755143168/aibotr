import axios from 'axios'
import {MessageBox} from 'element-ui'
import router from '@/router/index'
import {signature,getTimeStamp,app_info,str16} from '../utils/signature'

export const base_url =  process.env.API_BASE_URL
const service = axios.create()
export const myGet = url => 
  service({
    url: base_url + url,
    method: 'get'
  })
export const myPost = (url,data) => 
  service({
    url: base_url + url,
    method: 'post',
    data
  })
export const exportExcel = (url,data) => 
  service({
    url: base_url + url,
    method: 'post',
    responseType: 'blob',
    data
  })
export const login = (url,data) => axios.post(base_url + url,data)
service.interceptors.request.use(
    config => {
      const myToken = sessionStorage.getItem('Token')
      if (myToken) {
        config.headers['Token'] = myToken // 让每个请求携带自定义token
      }
      return config
    },
    error => {
      // Do something with request error
      Promise.reject(error)
    }
)
service.interceptors.response.use(
  response => {
    if(response.data.code!=200){
      if(response.data.code == 401) {
        MessageBox.alert('登录已过期，请重新登录！')
        sessionStorage.setItem('isLogin',false)
        router.push({ path: '/login'})
      }
      else if(response.data.code == 403) {
        MessageBox.alert('您没有访问权限')
        // return Promise.reject('error')
      }
      else if(response.data.code == 404) {
        MessageBox.alert('访问失败，请检查网络')
      }
      else if(response.data.code === undefined) {
        return response
      }
      else {
        MessageBox.alert(response.data.message,'警告',{
          confirmButtonClass: "el-button--myPrimary",
          type: "warning"
        })
      }
      return Promise.reject('error')
    }
    else {
      return response
    }
  },
  error => {
    return Promise.reject(error)
  }
)