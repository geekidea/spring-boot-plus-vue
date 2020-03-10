import request from '@/utils/request'

const sysPermissionApi = {

}

/**
 * 获取系统所有树形菜单
 * @param data
 * @returns {AxiosPromise}
 */
sysPermissionApi.getAllMenuTree = () => {
  return request({
    url: '/sysPermission/getAllMenuTree',
    method: 'post'
  })
}

/**
 * 获取系统部门列表
 * @param data
 * @returns {AxiosPromise}
 */
sysPermissionApi.detail = id => {
  return request({
    url: '/sysPermission/info/' + id,
    method: 'get'
  })
}

/**
 * 根据角色id获取该对应的所有三级权限ID
 * @param data
 * @returns {AxiosPromise}
 */
sysPermissionApi.getMenuIdsByRoleId = roleId => {
  return request({
    url: '/sysPermission/getThreeLevelPermissionIdsByRoleId/' + roleId,
    method: 'get'
  })
}

/**
 * 获取所有导航菜单(一级/二级菜单)
 * @param data
 * @returns {AxiosPromise}
 */
sysPermissionApi.getNavMenuTree = () => {
  return request({
    url: '/sysPermission/getNavMenuTree',
    method: 'post'
  })
}

/**
 * 添加菜单
 * @param data
 * @returns {AxiosPromise}
 */
sysPermissionApi.add = data => {
  return request({
    url: '/sysPermission/add',
    method: 'post',
    data
  })
}

/**
 * 修改菜单
 * @param data
 * @returns {AxiosPromise}
 */
sysPermissionApi.update = data => {
  return request({
    url: '/sysPermission/update',
    method: 'post',
    data
  })
}

/**
 * 删除菜单
 * @param data
 * @returns {AxiosPromise}
 */
sysPermissionApi.delete = id => {
  return request({
    url: '/sysPermission/delete/' + id,
    method: 'post'
  })
}

export default sysPermissionApi

