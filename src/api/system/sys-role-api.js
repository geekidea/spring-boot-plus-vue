import request from '@/utils/request'

const sysRoleApi = {

}

/**
 * 获取系统部门列表
 * @param data
 * @returns {AxiosPromise}
 */
sysRoleApi.getList = data => {
  return request({
    url: '/sysRole/getList',
    method: 'post',
    data
  })
}

/**
 * 获取系统部门列表
 * @param data
 * @returns {AxiosPromise}
 */
sysRoleApi.getPageList = data => {
  return request({
    url: '/sysRole/getPageList',
    method: 'post',
    data
  })
}

/**
 * 获取系统部门列表
 * @param data
 * @returns {AxiosPromise}
 */
sysRoleApi.detail = id => {
  return request({
    url: '/sysRole/info/' + id,
    method: 'get'
  })
}

/**
 * 添加角色
 * @param data
 * @returns {AxiosPromise}
 */
sysRoleApi.add = data => {
  return request({
    url: '/sysRole/add',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 * @param data
 * @returns {AxiosPromise}
 */
sysRoleApi.update = data => {
  return request({
    url: '/sysRole/update',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param data
 * @returns {AxiosPromise}
 */
sysRoleApi.delete = id => {
  return request({
    url: '/sysRole/delete/' + id,
    method: 'post'
  })
}


/**
 * 修改系统角色权限
 * @param data
 * @returns {AxiosPromise}
 */
sysRoleApi.updateSysRolePermission = data => {
  return request({
    url: '/sysRole/updateSysRolePermission',
    method: 'post',
    data
  })
}

export default sysRoleApi

