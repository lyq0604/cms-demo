import request from '@/utils/request'

const APT_SYSTEM_PREFIX = '/api/system'

/**
 * 用户登录
 * @param data
 */
export function login(data) {
  return request({
    url: APT_SYSTEM_PREFIX + '/users/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param token
 */
export function getInfo() {
  return request({
    url: APT_SYSTEM_PREFIX + '/users/info',
    method: 'get'
  })
}

/**
 * 退出
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
