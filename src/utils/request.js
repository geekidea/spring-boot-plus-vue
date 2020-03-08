import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// https://github.com/axios/axios
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const code = res.code
    const resultData = response.data.data;

    // if the custom code is not 20000, it is judged as an error.
    if (code !== 200) {
      // 5001: 请求参数校验异常
      if (code === 5001) {
        let errorMessage = ''
        if (resultData) {
          if (resultData instanceof Array) {
            const length = resultData.length
            resultData.forEach((item, index) => {
              console.log(index + '-' + item)
              errorMessage += item
              if (index !== (length - 1)) {
                errorMessage += "<br/><br/>"
              }
            })
          } else {
            errorMessage += resultData
          }
        } else {
          errorMessage = '请求参数校验异常'
        }
        Message({
          message: errorMessage || 'Error',
          type: 'error',
          dangerouslyUseHTMLString: true,
          duration: 5 * 1000
        })
      } else if (code === 50008 || code === 50012 || code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      Promise.reject(new Error(res.message || 'Error'))
      // 当状态码不是200时，是否需要返回响应结果给调用方
      return res
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
