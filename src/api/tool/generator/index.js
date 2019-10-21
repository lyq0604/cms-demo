import request from '@/utils/request'

/**
 * 获取数据库
 * @param data
 */
export function selectDatabaseList() {
  return request({
    url: '/api/system/generator/databases',
    method: 'get'
  })
}

/**
 * 查询表
 */
export function selectTableList(query) {
  return request({
    url: `/api/system/generator/tables`,
    method: 'get',
    params: query
  })
}

/**
 * 查询列
 * @param query
 */
export function selectColumnList(query) {
  return request({
    url: `/api/system/generator/columns`,
    method: 'get',
    params: query
  })
}

/**
 * 生成代码
 * @param item
 */
export function generateCode(item) {
  return request({
    url: '/api/system/generator/generate',
    method: 'post',
    data: item
  })
}
