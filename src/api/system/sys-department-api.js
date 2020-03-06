import request from '@/utils/request'

const sysDepartmentApi = {

}

/**
 * 获取系统部门列表
 * @param data
 * @returns {AxiosPromise}
 */
sysDepartmentApi.getList = data => {
  return request({
    url: '/sysDepartment/getList',
    method: 'post',
    data
  })
}

/**
 * 获取系统部门列表
 * @param data
 * @returns {AxiosPromise}
 */
sysDepartmentApi.getDepartmentTree = data => {
  return request({
    url: '/sysDepartment/getDepartmentTree',
    method: 'post',
    data
  })
}

export default sysDepartmentApi

