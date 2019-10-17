import request from '@/utils/request'

/**
 * 获取菜单列表
 */
export function getMenuList() {
  return request({
    url: '/api/system/menus/list',
    method: 'get'
  })
}

/**
 * 获取菜单树
 */
export function getMenuTree() {
  return request({
    url:  '/api/system/menus/tree',
    method: 'get'
  })
}

/**
 * 获取menu及其挂载操作按钮信息
 * @param id
 */
export function getMenuVo(id) {
  return request({
    url: `/api/system/menus/vo/${id}`,
    method: 'get'
  })
}

/**
 * 添加菜单
 * @param menu
 */
export function createMenu(menu) {
  return request({
    url: '/api/system/menus/add',
    method: 'post',
    data: menu
  })
}

/**
 * 根据ID删除
 * @param id
 */
export function deleteMenu(id) {
  return request({
    url: `/api/system/menus/${id}`,
    method: 'delete'
  })
}

/**
 * 根据主键修改
 * @param menu
 */
export function modifyMenu(menu) {
  return request({
    url: '/api/system/menus/update',
    method: 'put',
    data: menu
  })
}
