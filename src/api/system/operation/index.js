import request from '@/utils/request'

/**
 * 创建操作权限
 * @param operation
 */
export function createOperation(operation) {
  return request({
    url: '/api/system/operations/add',
    method: 'post',
    data: operation
  })
}

/**
 * 更新操作权限
 * @param operation
 */
export function updateOperation(operation) {
  return request({
    url: '/api/system/operations/update',
    method: 'put',
    data: operation
  })
}

/**
 * 根据主键删除
 */
export function deleteByIds(ids) {
  return request({
    url: `/api/system/operations/batchDelete`,
    method: 'delete',
    data: ids
  })
}

/**
 * 根据菜单id获取操作列表
 * @param menuId
 */
export function selectByMenuId(menuId) {
  return request({
    url: `/api/system/operations/menu/${menuId}`,
    method: 'get'
  })
}
