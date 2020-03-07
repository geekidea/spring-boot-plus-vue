import request from '@/utils/request'

const uploadApi = {

}

/**
 * 上传文件
 * @param data
 * @returns {AxiosPromise}
 */
uploadApi.upload = data => {
  return request({
    url: '/upload',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export default uploadApi
