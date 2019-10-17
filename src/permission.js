import router from './router'
import DynamicRoutes from './router/dynamicRoutes'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout/index'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist


/**
 * 根据用户权限生成路由
 * @param DynamicRoutes 动态路由表
 * @param permissions 用户权限
 */
export function generateMenu(DynamicRoutes, permissions) {
  const routers = []
  DynamicRoutes.forEach((route) => {
    if (route.meta.permission == undefined || route.meta.permission == null || permissions.indexOf(route.meta.permission) > -1) {
      console.log('添加路由')
      let child = route.children
      route.children = []
      if (child !== undefined && child.length > 0) {
        route.children = generateMenu(child, permissions)
      }
      routers.push(route)
    }
  })
  return routers;
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          store.dispatch('getInfo').then((data) => {
            const routers = generateMenu(DynamicRoutes, data.permissions)
            router.addRoutes(routers)
            let constantRouters = router.options.routes
            constantRouters = constantRouters.concat(routers)
            constantRouters.push({
              path: '*', redirect: '/404', hidden: true
            })
            router.options.routes = constantRouters
            next()
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
